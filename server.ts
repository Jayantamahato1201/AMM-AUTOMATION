import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { storage, seedMongoIfConnected } from './server/storage.js';
import { connectDB } from './server/config/db.js';
import { upload } from './server/middleware/uploadMiddleware.js';
import { sendContactNotificationEmail, sendQuoteNotificationEmail } from './server/utils/mailer.js';
import {
  securityHeaders,
  getCorsMiddleware,
  generalApiLimiter,
  enquiryLimiter,
  loginLimiter,
  aiAdvisorLimiter,
  bruteForceGuard,
  requestLogger,
  errorHandler
} from './server/security.js';
import {
  AdminLoginInputSchema,
  CreateServiceInputSchema,
  UpdateServiceInputSchema,
  CreateIndustryInputSchema,
  UpdateIndustryInputSchema,
  CreatePartnerCompanyInputSchema,
  UpdatePartnerCompanyInputSchema,
  CreateContactInquiryInputSchema,
  UpdateContactInquiryInputSchema,
  CreateQuoteRequestInputSchema,
  UpdateQuoteRequestInputSchema,
  CreateTestimonialInputSchema,
  UpdateTestimonialInputSchema,
  CreateNewsletterSubscriberInputSchema,
  UpdateSiteSettingsInputSchema,
  AISolutionQuerySchema,
  sanitizeString,
  sanitizeArray
} from './server/schema.js';
import { generateAutomationAdvice } from './server/gemini.js';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'amm-automation-default-jwt-secret-key-2025';
const serverStartTime = Date.now();

// Enable trust proxy for reverse proxies (Cloud Run, Nginx, etc.)
app.set('trust proxy', 1);

// Ensure uploads folder exists and serve statically
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// 1. Security & Core Middlewares
app.use(securityHeaders);
app.use(getCorsMiddleware());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(requestLogger);

// 2. Auth Middleware
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'superadmin';
    name?: string;
  };
  file?: Express.Multer.File;
}

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: 'admin' | 'superadmin';
      name?: string;
    };
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Session expired. Please log in again.' });
      return;
    }
    res.status(401).json({ error: 'Invalid or revoked authentication token.' });
  }
};

// ==================== API ROUTES ====================

// Apply general rate limiter across /api/*
app.use('/api', generalApiLimiter);

// 1. Health & Status
app.get('/api/health', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
  const dbHealth = storage.getHealthStatus();

  res.json({
    status: 'ok',
    service: 'AMM Automation API',
    uptimeSeconds,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbHealth
  });
});

// 2. Authentication & Admin Authorization
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const parseResult = AdminLoginInputSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.issues[0]?.message || 'Invalid login details.' });
    return;
  }

  const { email, password } = parseResult.data;
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const lockoutKey = `${ip}:${email.toLowerCase()}`;

  // Check Brute Force lockout
  const lockStatus = bruteForceGuard.isLocked(lockoutKey);
  if (lockStatus.locked) {
    res.status(429).json({
      error: `Account temporarily locked due to repeated failed logins. Please retry in ${lockStatus.remainingSeconds} seconds.`
    });
    return;
  }

  const admin = await storage.getAdminByEmail(email);
  if (!admin) {
    bruteForceGuard.recordFailure(lockoutKey);
    res.status(401).json({ error: 'Invalid email address or password.' });
    return;
  }

  const isPasswordValid = storage.verifyAdminPassword(password, admin.passwordHash);
  if (!isPasswordValid) {
    const failResult = bruteForceGuard.recordFailure(lockoutKey);
    if (failResult.locked) {
      res.status(429).json({
        error: `Too many invalid attempts. Access locked for ${failResult.remainingSeconds} seconds.`
      });
      return;
    }
    res.status(401).json({ error: 'Invalid email address or password.' });
    return;
  }

  // Clear failed attempt history
  bruteForceGuard.recordSuccess(lockoutKey);

  // Generate short-lived Access Token (2h)
  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  // Generate Refresh Token (7d)
  const refreshToken = jwt.sign(
    { id: admin.id, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    refreshToken,
    expiresIn: 7200,
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});

app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ error: 'Refresh token is required.' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string; type?: string };
    if (decoded.type !== 'refresh') {
      res.status(401).json({ error: 'Invalid token type.' });
      return;
    }

    const adminUser = await storage.getAdminByEmail(process.env.ADMIN_EMAIL || 'admin@ammautomation.com');
    if (!adminUser) {
      res.status(401).json({ error: 'User no longer exists.' });
      return;
    }

    const newAccessToken = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: adminUser.role, name: adminUser.name },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token: newAccessToken,
      expiresIn: 7200
    });
  } catch {
    res.status(401).json({ error: 'Refresh token expired or invalid.' });
  }
});

app.get('/api/auth/me', requireAdmin, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

app.put('/api/auth/password', requireAdmin, async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    return;
  }

  if (!req.user?.email) {
    res.status(401).json({ error: 'User context not found.' });
    return;
  }

  const admin = await storage.getAdminByEmail(req.user.email);
  if (!admin || !storage.verifyAdminPassword(currentPassword, admin.passwordHash)) {
    res.status(400).json({ error: 'Current password does not match.' });
    return;
  }

  await storage.updateAdminPassword(admin.email, newPassword);
  res.json({ message: 'Password updated successfully.' });
});

// 3. Partner Companies (CRUD & Public View)
app.get('/api/partners', async (req, res) => {
  const onlyActive = req.query.all !== 'true';
  const partners = await storage.getPartners(onlyActive);
  res.json(partners);
});

app.get('/api/partners/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;
  let partner = await storage.getPartnerBySlug(idOrSlug);
  if (!partner) {
    partner = await storage.getPartnerById(idOrSlug);
  }
  if (!partner) {
    res.status(404).json({ error: 'Partner company not found.' });
    return;
  }
  res.json(partner);
});

app.post('/api/partners', requireAdmin, async (req, res) => {
  const parsed = CreatePartnerCompanyInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid partner company payload.' });
    return;
  }

  const data = parsed.data;
  const newPartner = await storage.createPartner({
    companyName: sanitizeString(data.companyName),
    slug: data.slug ? sanitizeString(data.slug) : data.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    websiteUrl: data.websiteUrl.trim(),
    displayUrl: data.displayUrl ? sanitizeString(data.displayUrl) : data.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    category: sanitizeString(data.category),
    shortDescription: sanitizeString(data.shortDescription),
    fullDescription: data.fullDescription ? sanitizeString(data.fullDescription) : undefined,
    logo: data.logo || undefined,
    tags: sanitizeArray(data.tags),
    establishedRole: data.establishedRole ? sanitizeString(data.establishedRole) : undefined,
    isActive: data.isActive ?? true,
    displayOrder: data.displayOrder ?? 1
  });

  res.status(201).json(newPartner);
});

app.put('/api/partners/:id', requireAdmin, async (req, res) => {
  const parsed = UpdatePartnerCompanyInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid partner company update data.' });
    return;
  }

  const updated = await storage.updatePartner(req.params.id, parsed.data);
  if (!updated) {
    res.status(404).json({ error: 'Partner company not found.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/partners/:id', requireAdmin, async (req, res) => {
  const success = await storage.deletePartner(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Partner company not found.' });
    return;
  }
  res.json({ message: 'Partner company removed successfully.' });
});

// 4. Services / Solutions
app.get('/api/services', (req, res) => {
  const onlyActive = req.query.all !== 'true';
  const services = storage.getServices(onlyActive);
  res.json(services);
});

app.get('/api/services/:slug', (req, res) => {
  const service = storage.getServiceBySlug(req.params.slug);
  if (!service) {
    res.status(404).json({ error: 'Engineering service solution not found.' });
    return;
  }
  res.json(service);
});

app.post('/api/services', requireAdmin, (req, res) => {
  const parsed = CreateServiceInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid service payload.' });
    return;
  }

  const data = parsed.data;
  const newService = storage.createService({
    title: sanitizeString(data.title),
    slug: sanitizeString(data.slug),
    shortDescription: sanitizeString(data.shortDescription),
    fullDescription: sanitizeString(data.fullDescription || data.shortDescription),
    category: data.category ? sanitizeString(data.category) : 'Industrial Automation',
    image: data.image || '/images/hero_automation.jpg',
    iconName: data.iconName || data.icon || 'Cpu',
    features: sanitizeArray(data.features),
    applications: sanitizeArray(data.applications),
    relatedIndustries: sanitizeArray(data.relatedIndustries),
    subOfferings: sanitizeArray(data.subOfferings),
    isActive: data.isActive ?? true,
    order: data.order ?? data.displayOrder ?? 99,
    displayOrder: data.displayOrder ?? data.order ?? 99
  });

  res.status(201).json(newService);
});

app.put('/api/services/:id', requireAdmin, (req, res) => {
  const parsed = UpdateServiceInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid service update data.' });
    return;
  }

  const updated = storage.updateService(req.params.id, parsed.data);
  if (!updated) {
    res.status(404).json({ error: 'Service not found.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/services/:id', requireAdmin, (req, res) => {
  const success = storage.deleteService(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Service not found.' });
    return;
  }
  res.json({ message: 'Service deleted successfully.' });
});

// 5. Industries
app.get('/api/industries', (req, res) => {
  const onlyActive = req.query.all !== 'true';
  const industries = storage.getIndustries(onlyActive);
  res.json(industries);
});

app.get('/api/industries/:slug', (req, res) => {
  const industry = storage.getIndustryBySlug(req.params.slug);
  if (!industry) {
    res.status(404).json({ error: 'Industry domain profile not found.' });
    return;
  }
  res.json(industry);
});

app.post('/api/industries', requireAdmin, (req, res) => {
  const parsed = CreateIndustryInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid industry payload.' });
    return;
  }

  const data = parsed.data;
  const newIndustry = storage.createIndustry({
    name: sanitizeString(data.name || data.title || ''),
    slug: sanitizeString(data.slug),
    description: sanitizeString(data.description || data.fullDescription || ''),
    shortDescription: data.shortDescription ? sanitizeString(data.shortDescription) : undefined,
    image: data.image || '/images/metal_plant.jpg',
    iconName: data.iconName || data.icon || 'Factory',
    challenges: sanitizeArray(data.challenges),
    solutions: sanitizeArray(data.solutions),
    relatedServices: sanitizeArray(data.relatedServices),
    isActive: data.isActive ?? true,
    order: data.order ?? data.displayOrder ?? 99,
    displayOrder: data.displayOrder ?? data.order ?? 99
  });

  res.status(201).json(newIndustry);
});

app.put('/api/industries/:id', requireAdmin, (req, res) => {
  const parsed = UpdateIndustryInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid industry update data.' });
    return;
  }

  const updated = storage.updateIndustry(req.params.id, parsed.data);
  if (!updated) {
    res.status(404).json({ error: 'Industry not found.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/industries/:id', requireAdmin, (req, res) => {
  const success = storage.deleteIndustry(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Industry not found.' });
    return;
  }
  res.json({ message: 'Industry deleted successfully.' });
});

// 6. Contact Inquiries (Dual endpoints for /api/contact & /api/enquiries)
const handleContactSubmission = async (req: Request, res: Response) => {
  const parsed = CreateContactInquiryInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Please check your contact form inputs.' });
    return;
  }

  const { name, companyName, email, phone, subject, service, serviceInterest, message } = parsed.data;

  const inquiry = storage.createInquiry({
    name: sanitizeString(name),
    companyName: companyName ? sanitizeString(companyName) : 'Not specified',
    email: email.trim(),
    phone: sanitizeString(phone),
    subject: subject ? sanitizeString(subject) : 'Industrial Automation Enquiry',
    service: service || serviceInterest ? sanitizeString(service || serviceInterest || '') : 'General Enquiry',
    serviceInterest: serviceInterest || service ? sanitizeString(serviceInterest || service || '') : 'General Enquiry',
    message: sanitizeString(message)
  });

  console.log(`[Contact Inquiry] Logged inquiry ID: ${inquiry.id} for client: ${name} (${companyName || 'N/A'})`);

  // Dispatch background email notification (Nodemailer)
  sendContactNotificationEmail(inquiry).catch(err => console.error('[Mailer] Contact alert error:', err));

  res.status(201).json({
    message: 'Thank you! Your inquiry has been received. An AMM Automation technical specialist will contact you shortly.',
    inquiryId: inquiry.id,
    id: inquiry.id
  });
};

app.post('/api/contact', enquiryLimiter, handleContactSubmission);
app.post('/api/enquiries', enquiryLimiter, handleContactSubmission);

app.get('/api/contact', requireAdmin, (req, res) => {
  res.json(storage.getInquiries());
});
app.get('/api/enquiries', requireAdmin, (req, res) => {
  res.json(storage.getInquiries());
});

app.get('/api/contact/:id', requireAdmin, (req, res) => {
  const item = storage.getInquiryById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Inquiry not found.' });
  res.json(item);
});
app.get('/api/enquiries/:id', requireAdmin, (req, res) => {
  const item = storage.getInquiryById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Inquiry not found.' });
  res.json(item);
});

app.put('/api/contact/:id', requireAdmin, (req, res) => {
  const parsed = UpdateContactInquiryInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid inquiry update.' });
    return;
  }

  const updated = storage.updateInquiry(req.params.id, parsed.data);
  if (!updated) {
    res.status(404).json({ error: 'Inquiry not found.' });
    return;
  }
  res.json(updated);
});
app.put('/api/enquiries/:id', requireAdmin, (req, res) => {
  const parsed = UpdateContactInquiryInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid enquiry update.' });
    return;
  }

  const updated = storage.updateInquiry(req.params.id, parsed.data);
  if (!updated) {
    res.status(404).json({ error: 'Enquiry not found.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/contact/:id', requireAdmin, (req, res) => {
  const success = storage.deleteInquiry(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Inquiry not found.' });
    return;
  }
  res.json({ message: 'Inquiry deleted successfully.' });
});
app.delete('/api/enquiries/:id', requireAdmin, (req, res) => {
  const success = storage.deleteInquiry(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Enquiry not found.' });
    return;
  }
  res.json({ message: 'Enquiry deleted successfully.' });
});

// 7. Quote Requests (RFQs)
app.post('/api/quotes', enquiryLimiter, async (req, res) => {
  const parsed = CreateQuoteRequestInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Please check your quote request inputs.' });
    return;
  }

  const data = parsed.data;
  const quote = storage.createQuote({
    name: sanitizeString(data.name),
    email: data.email.trim(),
    phone: sanitizeString(data.phone),
    companyName: data.companyName ? sanitizeString(data.companyName) : 'Not specified',
    industry: data.industry ? sanitizeString(data.industry) : undefined,
    requiredService: sanitizeString(data.requiredService),
    projectDescription: sanitizeString(data.projectDescription),
    estimatedBudget: data.estimatedBudget ? sanitizeString(data.estimatedBudget) : undefined,
    preferredContactMethod: data.preferredContactMethod || 'email'
  });

  console.log(`[Quote Request] Logged RFQ ID: ${quote.id} from: ${quote.name} (${quote.companyName})`);

  // Dispatch background email notification (Nodemailer)
  sendQuoteNotificationEmail(quote).catch(err => console.error('[Mailer] Quote alert error:', err));

  res.status(201).json({
    message: 'Your Request for Quote (RFQ) has been logged. Our engineering estimation team will review your specifications and contact you.',
    quoteId: quote.id,
    id: quote.id
  });
});

app.get('/api/quotes', requireAdmin, (req, res) => {
  res.json(storage.getQuotes());
});

app.get('/api/quotes/:id', requireAdmin, (req, res) => {
  const quote = storage.getQuoteById(req.params.id);
  if (!quote) return res.status(404).json({ error: 'Quote request not found.' });
  res.json(quote);
});

app.put('/api/quotes/:id', requireAdmin, (req, res) => {
  const parsed = UpdateQuoteRequestInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid quote request update.' });
    return;
  }

  const updated = storage.updateQuote(req.params.id, parsed.data);
  if (!updated) return res.status(404).json({ error: 'Quote request not found.' });
  res.json(updated);
});

app.delete('/api/quotes/:id', requireAdmin, (req, res) => {
  const success = storage.deleteQuote(req.params.id);
  if (!success) return res.status(404).json({ error: 'Quote request not found.' });
  res.json({ message: 'Quote request removed successfully.' });
});

// 8. Testimonials
app.get('/api/testimonials', (req, res) => {
  const onlyActive = req.query.all !== 'true';
  res.json(storage.getTestimonials(onlyActive));
});

app.post('/api/testimonials', requireAdmin, (req, res) => {
  const parsed = CreateTestimonialInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid testimonial payload.' });
    return;
  }

  const data = parsed.data;
  const newTestimonial = storage.createTestimonial({
    clientName: sanitizeString(data.clientName),
    company: sanitizeString(data.company),
    designation: data.designation ? sanitizeString(data.designation) : undefined,
    testimonial: sanitizeString(data.testimonial),
    rating: data.rating ?? 5,
    image: data.image || undefined,
    isActive: data.isActive ?? true,
    displayOrder: data.displayOrder ?? 1
  });

  res.status(201).json(newTestimonial);
});

app.put('/api/testimonials/:id', requireAdmin, (req, res) => {
  const parsed = UpdateTestimonialInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid testimonial update.' });
    return;
  }

  const updated = storage.updateTestimonial(req.params.id, parsed.data);
  if (!updated) return res.status(404).json({ error: 'Testimonial not found.' });
  res.json(updated);
});

app.delete('/api/testimonials/:id', requireAdmin, (req, res) => {
  const success = storage.deleteTestimonial(req.params.id);
  if (!success) return res.status(404).json({ error: 'Testimonial not found.' });
  res.json({ message: 'Testimonial deleted successfully.' });
});

// 9. Newsletter Subscription
app.post('/api/newsletter/subscribe', (req, res) => {
  const parsed = CreateNewsletterSubscriberInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Please provide a valid email.' });
    return;
  }

  const result = storage.subscribeNewsletter(parsed.data.email);
  res.json(result);
});

app.post('/api/newsletter/unsubscribe', (req, res) => {
  const parsed = CreateNewsletterSubscriberInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid email.' });
    return;
  }

  const success = storage.unsubscribeNewsletter(parsed.data.email);
  res.json({ success, message: success ? 'Unsubscribed successfully.' : 'Email not found in subscriber list.' });
});

app.get('/api/newsletter/subscribers', requireAdmin, (req, res) => {
  res.json(storage.getNewsletterSubscribers());
});

// 10. File & Image Uploads (Multer)
app.post('/api/uploads', requireAdmin, upload.single('image'), (req: AuthRequest, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file uploaded or invalid file format.' });
    return;
  }

  const relativeUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({
    message: 'Image uploaded successfully.',
    url: relativeUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// 11. Website Copywriting, Settings & Company Profile
app.get('/api/settings', (req, res) => {
  res.json(storage.getContent());
});
app.get('/api/content', (req, res) => {
  res.json(storage.getContent());
});

app.put('/api/settings', requireAdmin, (req, res) => {
  const parsed = UpdateSiteSettingsInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid settings payload.' });
    return;
  }

  const updated = storage.updateContent(parsed.data);
  res.json(updated);
});
app.put('/api/content', requireAdmin, (req, res) => {
  const parsed = UpdateSiteSettingsInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid content payload.' });
    return;
  }

  const updated = storage.updateContent(parsed.data);
  res.json(updated);
});

// 12. Overview Stats
app.get('/api/stats', (req, res) => {
  const stats = storage.getStats();
  res.json(stats);
});

// 13. AI Solution Advisor (Gemini 3.7 Flash)
app.post('/api/ai/solution-advisor', aiAdvisorLimiter, async (req, res) => {
  const parsed = AISolutionQuerySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Please provide your plant automation requirements.' });
    return;
  }

  const { query, industry, plantType } = parsed.data;
  const result = await generateAutomationAdvice(query, industry, plantType);
  res.json(result);
});

// Catch-all for undefined /api/* routes so they NEVER return HTML
app.all('/api/*', (req, res) => {
  res.status(404).json({
    error: `API route not found: ${req.method} ${req.originalUrl}`,
    status: 404
  });
});

// 14. Centralized Express Error Handler
app.use(errorHandler);

// ==================== VITE & PRODUCTION SETUP ====================

let serverInstance: any = null;

async function start() {
  // Connect to MongoDB if configured, then seed default data if needed
  try {
    await connectDB();
    await seedMongoIfConnected();
  } catch (err) {
    console.warn('[AMM Server] MongoDB initialization note (will use local JSON engine):', err);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  serverInstance = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AMM Server] Running on http://0.0.0.0:${PORT} (Node: ${process.version}, PID: ${process.pid})`);
  });
}

// Graceful Shutdown handler for Cloud Run scaling & container stops
async function handleShutdown(signal: string) {
  console.log(`[AMM Server] Received ${signal}. Starting graceful shutdown...`);

  if (serverInstance) {
    serverInstance.close(async () => {
      console.log('[AMM Server] HTTP server closed.');
      await storage.flushPendingWrites();
      console.log('[AMM Server] Graceful shutdown completed.');
      process.exit(0);
    });

    // Force exit if close hangs for more than 10 seconds
    setTimeout(() => {
      console.error('[AMM Server] Graceful shutdown timed out, forcing exit.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

start();
