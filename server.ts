import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { storage } from './server/storage.js';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'amm-automation-secure-jwt-key-2025';

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. Admin token required.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
};

// ==================== API ROUTES ====================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', company: 'AMM Automation', timestamp: new Date().toISOString() });
});

// --- AUTH ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const admin = storage.getAdminByEmail(email);
  if (!admin) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const isValid = storage.verifyAdminPassword(password, admin.passwordHash);
  if (!isValid) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});

app.get('/api/auth/me', requireAdmin, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// --- SERVICES ---
app.get('/api/services', (req, res) => {
  const services = storage.getServices();
  res.json(services);
});

app.get('/api/services/:slug', (req, res) => {
  const service = storage.getServiceBySlug(req.params.slug);
  if (!service) {
    res.status(404).json({ error: 'Service not found.' });
    return;
  }
  res.json(service);
});

app.post('/api/services', requireAdmin, (req, res) => {
  const { title, slug, shortDescription, fullDescription, image, iconName, features, applications, relatedIndustries, subOfferings, isActive, order } = req.body;
  if (!title || !slug || !shortDescription) {
    res.status(400).json({ error: 'Title, slug, and short description are required.' });
    return;
  }

  const newService = storage.createService({
    title,
    slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    shortDescription,
    fullDescription: fullDescription || shortDescription,
    image: image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    iconName: iconName || 'Cpu',
    features: Array.isArray(features) ? features : [],
    applications: Array.isArray(applications) ? applications : [],
    relatedIndustries: Array.isArray(relatedIndustries) ? relatedIndustries : [],
    subOfferings: Array.isArray(subOfferings) ? subOfferings : [],
    isActive: isActive !== undefined ? isActive : true,
    order: order || 99
  });

  res.status(201).json(newService);
});

app.put('/api/services/:id', requireAdmin, (req, res) => {
  const updated = storage.updateService(req.params.id, req.body);
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

// --- INDUSTRIES ---
app.get('/api/industries', (req, res) => {
  const industries = storage.getIndustries();
  res.json(industries);
});

app.get('/api/industries/:slug', (req, res) => {
  const industry = storage.getIndustryBySlug(req.params.slug);
  if (!industry) {
    res.status(404).json({ error: 'Industry not found.' });
    return;
  }
  res.json(industry);
});

app.post('/api/industries', requireAdmin, (req, res) => {
  const { name, slug, description, image, iconName, challenges, solutions, relatedServices, isActive, order } = req.body;
  if (!name || !slug) {
    res.status(400).json({ error: 'Name and slug are required.' });
    return;
  }

  const newIndustry = storage.createIndustry({
    name,
    slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    description: description || '',
    image: image || 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    iconName: iconName || 'Factory',
    challenges: Array.isArray(challenges) ? challenges : [],
    solutions: Array.isArray(solutions) ? solutions : [],
    relatedServices: Array.isArray(relatedServices) ? relatedServices : [],
    isActive: isActive !== undefined ? isActive : true,
    order: order || 99
  });

  res.status(201).json(newIndustry);
});

app.put('/api/industries/:id', requireAdmin, (req, res) => {
  const updated = storage.updateIndustry(req.params.id, req.body);
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

// --- PROJECTS / PORTFOLIO ---
app.get('/api/projects', (req, res) => {
  const projects = storage.getProjects();
  res.json(projects);
});

app.get('/api/projects/:slug', (req, res) => {
  const project = storage.getProjectBySlug(req.params.slug);
  if (!project) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  res.json(project);
});

app.post('/api/projects', requireAdmin, (req, res) => {
  const { title, slug, shortDescription, fullDescription, featuredImage, gallery, industry, services, technologies, status, clientType, location, completionYear, isFeatured } = req.body;
  if (!title || !slug) {
    res.status(400).json({ error: 'Title and slug are required.' });
    return;
  }

  const newProject = storage.createProject({
    title,
    slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    shortDescription: shortDescription || '',
    fullDescription: fullDescription || shortDescription || '',
    featuredImage: featuredImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    gallery: Array.isArray(gallery) ? gallery : [],
    industry: industry || 'Steel Industry',
    services: Array.isArray(services) ? services : [],
    technologies: Array.isArray(technologies) ? technologies : [],
    status: status || 'Completed',
    clientType: clientType || 'Industrial Client',
    location: location || 'India',
    completionYear: completionYear || new Date().getFullYear().toString(),
    isFeatured: isFeatured || false
  });

  res.status(201).json(newProject);
});

app.put('/api/projects/:id', requireAdmin, (req, res) => {
  const updated = storage.updateProject(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/projects/:id', requireAdmin, (req, res) => {
  const success = storage.deleteProject(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  res.json({ message: 'Project deleted successfully.' });
});

// --- ENQUIRIES ---
app.post('/api/enquiries', (req, res) => {
  const { name, companyName, email, phone, subject, service, message } = req.body;

  // Validation
  if (!name || !email || !phone || !message) {
    res.status(400).json({ error: 'Please provide name, email, phone number, and enquiry details.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }

  const enquiry = storage.createEnquiry({
    name,
    companyName: companyName || 'Not specified',
    email,
    phone,
    subject: subject || 'Industrial Automation Enquiry',
    service: service || 'General Enquiry',
    message
  });

  // In production, Nodemailer could dispatch notifications to ammautomationsr@gmail.com
  console.log(`[Enquiry Notification] New enquiry received from ${name} (${companyName}) - Email: ${email}, Phone: ${phone}`);

  res.status(201).json({
    message: 'Thank you! Your enquiry has been received. An AMM Automation technical specialist will contact you shortly.',
    enquiryId: enquiry.id
  });
});

app.get('/api/enquiries', requireAdmin, (req, res) => {
  const enquiries = storage.getEnquiries();
  res.json(enquiries);
});

app.put('/api/enquiries/:id', requireAdmin, (req, res) => {
  const updated = storage.updateEnquiry(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Enquiry not found.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/enquiries/:id', requireAdmin, (req, res) => {
  const success = storage.deleteEnquiry(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Enquiry not found.' });
    return;
  }
  res.json({ message: 'Enquiry deleted successfully.' });
});

// --- WEBSITE CONTENT ---
app.get('/api/content', (req, res) => {
  const content = storage.getContent();
  res.json(content);
});

app.put('/api/content', requireAdmin, (req, res) => {
  const updated = storage.updateContent(req.body);
  res.json(updated);
});

// --- STATS ---
app.get('/api/stats', requireAdmin, (req, res) => {
  const stats = storage.getStats();
  res.json(stats);
});

// ==================== VITE & PRODUCTION SETUP ====================

async function start() {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AMM Automation server running on http://0.0.0.0:${PORT}`);
  });
}

start();
