import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  ServiceItem,
  IndustryItem,
  ProjectItem,
  EnquiryItem,
  WebsiteContent,
  AdminUser
} from '../src/types.js';
import {
  initialWebsiteContent,
  initialServices,
  initialIndustries,
  initialProjects,
  initialEnquiries
} from './data.js';

interface DatabaseSchema {
  admin: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: 'admin' | 'superadmin';
  };
  content: WebsiteContent;
  services: ServiceItem[];
  industries: IndustryItem[];
  projects: ProjectItem[];
  enquiries: EnquiryItem[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

let inMemoryDb: DatabaseSchema;

function initDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read persistent DB file, initializing fresh database:', err);
  }

  // Initial default admin: admin@ammautomation.com / Admin@12345
  const defaultSalt = bcrypt.genSaltSync(10);
  const defaultHash = bcrypt.hashSync('Admin@12345', defaultSalt);

  const initialData: DatabaseSchema = {
    admin: {
      id: 'admin-1',
      name: 'AMM Automation Administrator',
      email: 'admin@ammautomation.com',
      passwordHash: defaultHash,
      role: 'superadmin'
    },
    content: initialWebsiteContent,
    services: initialServices,
    industries: initialIndustries,
    projects: initialProjects,
    enquiries: initialEnquiries
  };

  saveDbToFile(initialData);
  return initialData;
}

function saveDbToFile(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}

inMemoryDb = initDb();

export const storage = {
  // Admin & Auth
  getAdminByEmail(email: string) {
    if (inMemoryDb.admin.email.toLowerCase() === email.toLowerCase()) {
      return inMemoryDb.admin;
    }
    return null;
  },

  verifyAdminPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  },

  updateAdminPassword(newPassword: string) {
    const salt = bcrypt.genSaltSync(10);
    inMemoryDb.admin.passwordHash = bcrypt.hashSync(newPassword, salt);
    saveDbToFile(inMemoryDb);
    return true;
  },

  // Content
  getContent(): WebsiteContent {
    return inMemoryDb.content;
  },

  updateContent(updated: Partial<WebsiteContent>): WebsiteContent {
    inMemoryDb.content = {
      ...inMemoryDb.content,
      ...updated
    };
    saveDbToFile(inMemoryDb);
    return inMemoryDb.content;
  },

  // Services
  getServices(): ServiceItem[] {
    return [...inMemoryDb.services].sort((a, b) => a.order - b.order);
  },

  getServiceBySlug(slug: string): ServiceItem | undefined {
    return inMemoryDb.services.find(s => s.slug === slug);
  },

  createService(service: Omit<ServiceItem, 'id' | 'createdAt'>): ServiceItem {
    const newService: ServiceItem = {
      ...service,
      id: `srv-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    inMemoryDb.services.push(newService);
    saveDbToFile(inMemoryDb);
    return newService;
  },

  updateService(id: string, updates: Partial<ServiceItem>): ServiceItem | null {
    const idx = inMemoryDb.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    inMemoryDb.services[idx] = {
      ...inMemoryDb.services[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDbToFile(inMemoryDb);
    return inMemoryDb.services[idx];
  },

  deleteService(id: string): boolean {
    const initialLen = inMemoryDb.services.length;
    inMemoryDb.services = inMemoryDb.services.filter(s => s.id !== id);
    if (inMemoryDb.services.length !== initialLen) {
      saveDbToFile(inMemoryDb);
      return true;
    }
    return false;
  },

  // Industries
  getIndustries(): IndustryItem[] {
    return [...inMemoryDb.industries].sort((a, b) => a.order - b.order);
  },

  getIndustryBySlug(slug: string): IndustryItem | undefined {
    return inMemoryDb.industries.find(i => i.slug === slug);
  },

  createIndustry(industry: Omit<IndustryItem, 'id'>): IndustryItem {
    const newIndustry: IndustryItem = {
      ...industry,
      id: `ind-${Date.now()}`
    };
    inMemoryDb.industries.push(newIndustry);
    saveDbToFile(inMemoryDb);
    return newIndustry;
  },

  updateIndustry(id: string, updates: Partial<IndustryItem>): IndustryItem | null {
    const idx = inMemoryDb.industries.findIndex(i => i.id === id);
    if (idx === -1) return null;
    inMemoryDb.industries[idx] = {
      ...inMemoryDb.industries[idx],
      ...updates
    };
    saveDbToFile(inMemoryDb);
    return inMemoryDb.industries[idx];
  },

  deleteIndustry(id: string): boolean {
    const initialLen = inMemoryDb.industries.length;
    inMemoryDb.industries = inMemoryDb.industries.filter(i => i.id !== id);
    if (inMemoryDb.industries.length !== initialLen) {
      saveDbToFile(inMemoryDb);
      return true;
    }
    return false;
  },

  // Projects
  getProjects(): ProjectItem[] {
    return [...inMemoryDb.projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getProjectBySlug(slug: string): ProjectItem | undefined {
    return inMemoryDb.projects.find(p => p.slug === slug);
  },

  createProject(project: Omit<ProjectItem, 'id' | 'createdAt'>): ProjectItem {
    const newProject: ProjectItem = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    inMemoryDb.projects.push(newProject);
    saveDbToFile(inMemoryDb);
    return newProject;
  },

  updateProject(id: string, updates: Partial<ProjectItem>): ProjectItem | null {
    const idx = inMemoryDb.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    inMemoryDb.projects[idx] = {
      ...inMemoryDb.projects[idx],
      ...updates
    };
    saveDbToFile(inMemoryDb);
    return inMemoryDb.projects[idx];
  },

  deleteProject(id: string): boolean {
    const initialLen = inMemoryDb.projects.length;
    inMemoryDb.projects = inMemoryDb.projects.filter(p => p.id !== id);
    if (inMemoryDb.projects.length !== initialLen) {
      saveDbToFile(inMemoryDb);
      return true;
    }
    return false;
  },

  // Enquiries
  getEnquiries(): EnquiryItem[] {
    return [...inMemoryDb.enquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createEnquiry(enquiry: Omit<EnquiryItem, 'id' | 'createdAt' | 'status'>): EnquiryItem {
    const newEnquiry: EnquiryItem = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    inMemoryDb.enquiries.unshift(newEnquiry);
    saveDbToFile(inMemoryDb);
    return newEnquiry;
  },

  updateEnquiry(id: string, updates: Partial<EnquiryItem>): EnquiryItem | null {
    const idx = inMemoryDb.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    inMemoryDb.enquiries[idx] = {
      ...inMemoryDb.enquiries[idx],
      ...updates
    };
    saveDbToFile(inMemoryDb);
    return inMemoryDb.enquiries[idx];
  },

  deleteEnquiry(id: string): boolean {
    const initialLen = inMemoryDb.enquiries.length;
    inMemoryDb.enquiries = inMemoryDb.enquiries.filter(e => e.id !== id);
    if (inMemoryDb.enquiries.length !== initialLen) {
      saveDbToFile(inMemoryDb);
      return true;
    }
    return false;
  },

  // Overview Stats
  getStats() {
    return {
      totalServices: inMemoryDb.services.length,
      activeServices: inMemoryDb.services.filter(s => s.isActive).length,
      totalIndustries: inMemoryDb.industries.length,
      activeIndustries: inMemoryDb.industries.filter(i => i.isActive).length,
      totalProjects: inMemoryDb.projects.length,
      totalEnquiries: inMemoryDb.enquiries.length,
      newEnquiries: inMemoryDb.enquiries.filter(e => e.status === 'New').length
    };
  }
};
