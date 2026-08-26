import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
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

// Ensure uploads folder exists and serve statically as local cache
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// 1. Security & Core Middlewares
app.use(securityHeaders);
app.use(getCorsMiddleware());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.amm_admin_token) {
    token = req.cookies.amm_admin_token;
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Missing administrator credentials.' });
    return;
  }

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
      res.status(401).json({ error: 'Admin session expired. Please log in again.' });
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

// 2. Authentication & Admin Authorization — STRICTLY ADMIN ONLY
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const parseResult = AdminLoginInputSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Invalid email address or password format.' });
    return;
  }

  const { email, password } = parseResult.data;
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const lockoutKey = `${ip}:${email.toLowerCase()}`;

  // Check Brute Force lockout (5 failed attempts -> 15 min lock)
  const lockStatus = bruteForceGuard.isLocked(lockoutKey);
  if (lockStatus.locked) {
    res.status(429).json({
      error: `Too many failed login attempts. Access is locked for ${lockStatus.remainingSeconds} seconds.`
    });
    return;
  }

  const admin = await storage.getAdminByEmail(email);
  if (!admin) {
    bruteForceGuard.recordFailure(lockoutKey);
    res.status(401).json({ error: 'Invalid credentials.' });
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
    res.status(401).json({ error: 'Invalid credentials.' });
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

  // Set secure HttpOnly cookie for production session management
  res.cookie('amm_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

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

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('amm_admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ success: true, message: 'Logged out successfully.' });
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

    res.cookie('amm_admin_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

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

  await storage.updateAdminPassword(req.user.email, newPassword);
  res.json({ message: 'Administrator password updated successfully.' });
});

// 3. Persistent Media / Image Uploads & Serving
app.post(
  ['/api/admin/media/upload', '/api/uploads'],
  requireAdmin,
  upload.single('image'),
  async (req: AuthRequest, res) => {
    // If field name was 'file' instead of 'image', multer might also catch it with fallback
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No image file uploaded or unsupported file format. Allowed: JPG, JPEG, PNG, WEBP.' });
      return;
    }

    const uniqueId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const diskFileName = `${uniqueId}${ext}`;

    // Write to local disk cache for fast local serving
    const diskFilePath = path.join(UPLOADS_DIR, diskFileName);
    try {
      if (file.buffer) {
        fs.writeFileSync(diskFilePath, file.buffer);
      }
    } catch (err) {
      console.warn('[AMM Server] Local disk cache write note:', err);
    }

    const publicUrl = `/api/media/${uniqueId}`;

    // Save into MongoDB and in-memory dual-store
    const saved = await storage.saveMedia({
      id: uniqueId,
      fileName: file.originalname,
      publicUrl,
      storageIdentifier: diskFileName,
      mimeType: file.mimetype,
      fileSize: file.size,
      altText: typeof req.body.altText === 'string' ? req.body.altText : file.originalname,
      relatedSection: typeof req.body.relatedSection === 'string' ? req.body.relatedSection : 'general',
      buffer: file.buffer
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded and persisted successfully.',
      url: publicUrl,
      id: uniqueId,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    });
  }
);

// Stream media directly from MongoDB / memory / disk cache
app.get('/api/media/:id', async (req, res) => {
  const mediaId = req.params.id;
  const media = await storage.getMediaById(mediaId);

  if (media && media.data) {
    res.setHeader('Content-Type', media.mimeType || 'image/jpeg');
    res.setHeader('Content-Length', media.data.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(media.data);
    return;
  }

  // Check if file exists on disk with that ID prefix
  const diskCandidates = fs.existsSync(UPLOADS_DIR)
    ? fs.readdirSync(UPLOADS_DIR).filter(f => f.startsWith(mediaId))
    : [];

  if (diskCandidates.length > 0) {
    const filePath = path.join(UPLOADS_DIR, diskCandidates[0]);
    res.sendFile(filePath);
    return;
  }

  res.status(404).json({ error: 'Media file not found.' });
});

app.get('/api/admin/media', requireAdmin, async (req, res) => {
  const mediaList = await storage.getAllMedia();
  res.json(mediaList);
});

app.delete('/api/admin/media/:id', requireAdmin, async (req, res) => {
  await storage.deleteMedia(req.params.id);
  res.json({ success: true, message: 'Media item deleted successfully.' });
});

// 4. Partner Companies
app.get(['/api/partners', '/api/admin/partners'], async (req, res) => {
  const isAll = req.query.all === 'true' || req.path.startsWith('/api/admin');
  const partners = await storage.getPartners(!isAll);
  res.json(partners);
});

app.get('/api/partners/:slug', async (req, res) => {
  const partner = await storage.getPartnerBySlug(req.params.slug);
  if (!partner) {
    res.status(404).json({ error: `Partner company '${req.params.slug}' not found.` });
    return;
  }
  res.json(partner);
});

app.post(['/api/partners', '/api/admin/partners'], requireAdmin, async (req, res) => {
  const parsed = CreatePartnerCompanyInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid partner company data.' });
    return;
  }

  const data = parsed.data;
  const newPartner = await storage.createPartner({
    companyName: sanitizeString(data.companyName),
    slug: sanitizeString(data.slug).toLowerCase(),
    websiteUrl: data.websiteUrl,
    displayUrl: data.displayUrl ? sanitizeString(data.displayUrl) : data.websiteUrl.replace(/^https?:\/\//, ''),
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

app.put(['/api/partners/:id', '/api/admin/partners/:id'], requireAdmin, async (req, res) => {
  const parsed = UpdatePartnerCompanyInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid partner company update.' });
    return;
  }

  const updated = await storage.updatePartner(req.params.id, parsed.data);
  if (!updated) {
    res.status(404).json({ error: 'Partner company not found.' });
    return;
  }
  res.json(updated);
});

app.delete(['/api/partners/:id', '/api/admin/partners/:id'], requireAdmin, async (req, res) => {
  const success = await storage.deletePartner(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Partner company not found.' });
    return;
  }
  res.json({ message: 'Partner company deleted successfully.' });
});

// 5. Services & Solutions
app.get(['/api/services', '/api/admin/services'], async (req, res) => {
  const isAll = req.query.all === 'true' || req.path.startsWith('/api/admin');
  const services = await storage.getServices(!isAll);
  res.json(services);
});

app.get('/api/services/:slug', async (req, res) => {
  const service = await storage.getServiceBySlug(req.params.slug);
  if (!service) {
    res.status(404).json({ error: `Service '${req.params.slug}' not found.` });
    return;
  }
  res.json(service);
});

app.post(['/api/services', '/api/admin/services'], requireAdmin, async (req, res) => {
  const parsed = CreateServiceInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid service data.' });
    return;
  }

  const data = parsed.data;
  const newService = await storage.createService({
    title: sanitizeString(data.title),
    slug: sanitizeString(data.slug).toLowerCase(),
    shortDescription: sanitizeString(data.shortDescription),
    fullDescription: data.fullDescription ? sanitizeString(data.fullDescription) : data.shortDescription,
    category: data.category ? sanitizeString(data.category) : 'Industrial Automation',
    image: data.image || '/images/hero_automation.jpg',
    iconName: data.iconName || 'Cpu',
    features: sanitizeArray(data.features),
    applications: sanitizeArray(data.applications),
    relatedIndustries: sanitizeArray(data.relatedIndustries),
    subOfferings: sanitizeArray(data.subOfferings),
    isActive: data.isActive ?? true,
    order: data.order ?? 99,
    displayOrder: data.displayOrder ?? data.order ?? 99,
    seoTitle: data.seoTitle ? sanitizeString(data.seoTitle) : undefined,
    seoDescription: data.seoDescription ? sanitizeString(data.seoDescription) : undefined
  });

  res.status(201).json(newService);
});

app.put(['/api/services/:id', '/api/admin/services/:id'], requireAdmin, async (req, res) => {
  const parsed = UpdateServiceInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid service update.' });
    return;
  }

  const updated = await storage.updateService(req.params.id, parsed.data);
  if (!updated) {
    res.status(404).json({ error: 'Service not found.' });
    return;
  }
  res.json(updated);
});

app.delete(['/api/services/:id', '/api/admin/services/:id'], requireAdmin, async (req, res) => {
  const success = await storage.deleteService(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Service not found.' });
    return;
  }
  res.json({ message: 'Service deleted successfully.' });
});

// 6. Industries
app.get(['/api/industries', '/api/admin/industries'], async (req, res) => {
  const isAll = req.query.all === 'true' || req.path.startsWith('/api/admin');
  const industries = await storage.getIndustries(!isAll);
  res.json(industries);
});

app.get('/api/industries/:slug', async (req, res) => {
  const industry = await storage.getIndustryBySlug(req.params.slug);
  if (!industry) {
    res.status(404).json({ error: `Industry '${req.params.slug}' not found.` });
    return;
  }
  res.json(industry);
});

app.post(['/api/industries', '/api/admin/industries'], requireAdmin, async (req, res) => {
  const parsed = CreateIndustryInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid industry data.' });
    return;
  }

  const data = parsed.data;
  const newIndustry = await storage.createIndustry({
    name: sanitizeString(data.name),
    slug: sanitizeString(data.slug).toLowerCase(),
    description: sanitizeString(data.description),
    shortDescription: data.shortDescription ? sanitizeString(data.shortDescription) : undefined,
    fullDescription: data.fullDescription ? sanitizeString(data.fullDescription) : undefined,
    image: data.image || '/images/metal_plant.jpg',
    iconName: data.iconName || 'Factory',
    challenges: sanitizeArray(data.challenges),
    solutions: sanitizeArray(data.solutions),
    relatedServices: sanitizeArray(data.relatedServices),
    isActive: data.isActive ?? true,
    order: data.order ?? 99,
    displayOrder: data.displayOrder ?? data.order ?? 99
  });

  res.status(201).json(newIndustry);
});

app.put(['/api/industries/:id', '/api/admin/industries/:id'], requireAdmin, async (req, res) => {
  const parsed = UpdateIndustryInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid industry update.' });
    return;
  }

  const updated = await storage.updateIndustry(req.params.id, parsed.data);
  if (!updated) {
    res.status(404).json({ error: 'Industry not found.' });
    return;
  }
  res.json(updated);
});

app.delete(['/api/industries/:id', '/api/admin/industries/:id'], requireAdmin, async (req, res) => {
  const success = await storage.deleteIndustry(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Industry not found.' });
    return;
  }
  res.json({ message: 'Industry deleted successfully.' });
});

// 7. Contact Inquiries & RFQs
app.post(['/api/contact', '/api/enquiries', '/api/admin/inquiries', '/api/admin/enquiries'], enquiryLimiter, async (req, res) => {
  const parsed = CreateContactInquiryInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid contact submission.' });
    return;
  }

  const data = parsed.data;
  const newInquiry = await storage.createInquiry({
    name: sanitizeString(data.name),
    email: sanitizeString(data.email).toLowerCase(),
    phone: sanitizeString(data.phone),
    companyName: data.companyName ? sanitizeString(data.companyName) : undefined,
    subject: data.subject ? sanitizeString(data.subject) : undefined,
    serviceInterest: data.serviceInterest ? sanitizeString(data.serviceInterest) : undefined,
    message: sanitizeString(data.message)
  });

  // Background email notification
  sendContactNotificationEmail(newInquiry).catch(err => {
    console.warn('[AMM Server] SMTP contact notification note:', err?.message || err);
  });

  res.status(201).json({
    message: 'Thank you. Your inquiry has been received by AMM Automation engineers.',
    inquiryId: newInquiry.id
  });
});

app.get(['/api/contact', '/api/enquiries', '/api/admin/inquiries', '/api/admin/enquiries'], requireAdmin, (req, res) => {
  res.json(storage.getInquiries());
});

app.get(['/api/contact/:id', '/api/enquiries/:id', '/api/admin/inquiries/:id', '/api/admin/enquiries/:id'], requireAdmin, (req, res) => {
  const inq = storage.getInquiryById(req.params.id);
  if (!inq) return res.status(404).json({ error: 'Inquiry not found.' });
  res.json(inq);
});

app.put(['/api/contact/:id', '/api/enquiries/:id', '/api/admin/inquiries/:id', '/api/admin/enquiries/:id'], requireAdmin, async (req, res) => {
  const parsed = UpdateContactInquiryInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid inquiry update.' });
    return;
  }

  const updated = await storage.updateInquiry(req.params.id, parsed.data);
  if (!updated) return res.status(404).json({ error: 'Inquiry not found.' });
  res.json(updated);
});

app.delete(['/api/contact/:id', '/api/enquiries/:id', '/api/admin/inquiries/:id', '/api/admin/enquiries/:id'], requireAdmin, async (req, res) => {
  const success = await storage.deleteInquiry(req.params.id);
  if (!success) return res.status(404).json({ error: 'Inquiry not found.' });
  res.json({ success: true, message: 'Inquiry removed successfully.' });
});

// 8. Quote Requests
app.post(['/api/quotes', '/api/admin/quotes'], enquiryLimiter, async (req, res) => {
  const parsed = CreateQuoteRequestInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid quote request submission.' });
    return;
  }

  const data = parsed.data;
  const newQuote = await storage.createQuote({
    name: sanitizeString(data.name),
    email: sanitizeString(data.email).toLowerCase(),
    phone: sanitizeString(data.phone),
    companyName: data.companyName ? sanitizeString(data.companyName) : undefined,
    industry: data.industry ? sanitizeString(data.industry) : undefined,
    requiredService: sanitizeString(data.requiredService),
    projectDescription: sanitizeString(data.projectDescription),
    estimatedBudget: data.estimatedBudget ? sanitizeString(data.estimatedBudget) : undefined,
    preferredContactMethod: data.preferredContactMethod || 'email'
  });

  // Background email notification
  sendQuoteNotificationEmail(newQuote).catch(err => {
    console.warn('[AMM Server] SMTP quote notification note:', err?.message || err);
  });

  res.status(201).json({
    message: 'Your RFQ quotation request has been lodged with AMM technical estimations.',
    quoteId: newQuote.id
  });
});

app.get(['/api/quotes', '/api/admin/quotes'], requireAdmin, (req, res) => {
  res.json(storage.getQuotes());
});

app.get(['/api/quotes/:id', '/api/admin/quotes/:id'], requireAdmin, (req, res) => {
  const quote = storage.getQuoteById(req.params.id);
  if (!quote) return res.status(404).json({ error: 'Quote request not found.' });
  res.json(quote);
});

app.put(['/api/quotes/:id', '/api/admin/quotes/:id'], requireAdmin, async (req, res) => {
  const parsed = UpdateQuoteRequestInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid quote request update.' });
    return;
  }

  const updated = await storage.updateQuote(req.params.id, parsed.data);
  if (!updated) return res.status(404).json({ error: 'Quote request not found.' });
  res.json(updated);
});

app.delete(['/api/quotes/:id', '/api/admin/quotes/:id'], requireAdmin, async (req, res) => {
  const success = await storage.deleteQuote(req.params.id);
  if (!success) return res.status(404).json({ error: 'Quote request not found.' });
  res.json({ success: true, message: 'Quote request removed successfully.' });
});

// 9. Testimonials
app.get(['/api/testimonials', '/api/admin/testimonials'], (req, res) => {
  const onlyActive = req.query.all !== 'true' && !req.path.startsWith('/api/admin');
  res.json(storage.getTestimonials(onlyActive));
});

app.post(['/api/testimonials', '/api/admin/testimonials'], requireAdmin, async (req, res) => {
  const parsed = CreateTestimonialInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid testimonial payload.' });
    return;
  }

  const data = parsed.data;
  const newTestimonial = await storage.createTestimonial({
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

app.put(['/api/testimonials/:id', '/api/admin/testimonials/:id'], requireAdmin, async (req, res) => {
  const parsed = UpdateTestimonialInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid testimonial update.' });
    return;
  }

  const updated = await storage.updateTestimonial(req.params.id, parsed.data);
  if (!updated) return res.status(404).json({ error: 'Testimonial not found.' });
  res.json(updated);
});

app.delete(['/api/testimonials/:id', '/api/admin/testimonials/:id'], requireAdmin, async (req, res) => {
  const success = await storage.deleteTestimonial(req.params.id);
  if (!success) return res.status(404).json({ error: 'Testimonial not found.' });
  res.json({ success: true, message: 'Testimonial deleted successfully.' });
});

// 10. Newsletter Subscription
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

// 11. Website Copywriting, Settings & CMS Control
app.get(['/api/settings', '/api/content', '/api/admin/site-settings'], (req, res) => {
  res.json(storage.getContent());
});

app.put(['/api/settings', '/api/content', '/api/admin/site-settings'], requireAdmin, (req, res) => {
  const parsed = UpdateSiteSettingsInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid settings payload.' });
    return;
  }

  const updated = storage.updateContent(parsed.data);
  res.json(updated);
});

app.get('/api/admin/content/:page', (req, res) => {
  const allContent = storage.getContent();
  res.json(allContent);
});

app.put('/api/admin/content/:page', requireAdmin, (req, res) => {
  const parsed = UpdateSiteSettingsInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid content payload.' });
    return;
  }
  const updated = storage.updateContent(parsed.data);
  res.json(updated);
});

// 12. Overview Stats
app.get(['/api/stats', '/api/admin/stats'], (req, res) => {
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
