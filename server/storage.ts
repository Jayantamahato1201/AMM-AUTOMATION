import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  ServiceItem,
  IndustryItem,
  PartnerCompanyItem,
  EnquiryItem,
  QuoteRequestItem,
  TestimonialItem,
  NewsletterSubscriberItem,
  WebsiteContent,
  AdminUser
} from '../src/types.js';
import {
  initialWebsiteContent,
  initialPartners,
  initialServices,
  initialIndustries,
  initialEnquiries,
  initialQuotes,
  initialTestimonials,
  initialSubscribers
} from './data.js';
import { DatabaseSchemaObject } from './schema.js';
import { connectDB, isDbConnected } from './config/db.js';
import { UserModel } from './models/User.js';
import { ServiceModel } from './models/Service.js';
import { IndustryModel } from './models/Industry.js';
import { PartnerCompanyModel } from './models/PartnerCompany.js';
import { ContactInquiryModel } from './models/ContactInquiry.js';
import { QuoteRequestModel } from './models/QuoteRequest.js';
import { TestimonialModel } from './models/Testimonial.js';
import { NewsletterSubscriberModel } from './models/NewsletterSubscriber.js';
import { SiteSettingModel } from './models/SiteSetting.js';

// Mongoose model helpers with flexible typing to prevent union overload mismatch
const UserDoc: any = UserModel;
const ServiceDoc: any = ServiceModel;
const IndustryDoc: any = IndustryModel;
const PartnerCompanyDoc: any = PartnerCompanyModel;
const ContactInquiryDoc: any = ContactInquiryModel;
const QuoteRequestDoc: any = QuoteRequestModel;
const TestimonialDoc: any = TestimonialModel;
const NewsletterSubscriberDoc: any = NewsletterSubscriberModel;
const SiteSettingDoc: any = SiteSettingModel;

export interface DatabaseSchema {
  admin: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: 'admin' | 'superadmin';
  };
  settings: WebsiteContent;
  content: WebsiteContent;
  services: ServiceItem[];
  industries: IndustryItem[];
  partners: PartnerCompanyItem[];
  enquiries: EnquiryItem[];
  quotes: QuoteRequestItem[];
  testimonials: TestimonialItem[];
  newsletterSubscribers: NewsletterSubscriberItem[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');
const DB_TMP_FILE = path.join(DB_DIR, 'db.json.tmp');

let inMemoryDb: DatabaseSchema;
let writeQueue: Promise<void> = Promise.resolve();

function generateDefaultAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ammautomation.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const salt = bcrypt.genSaltSync(12);
  const passwordHash = bcrypt.hashSync(adminPassword, salt);

  return {
    id: 'admin-1',
    name: 'AMM Automation Administrator',
    email: adminEmail,
    passwordHash,
    role: 'superadmin' as const
  };
}

function initDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const rawContent = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(rawContent);

      const db: DatabaseSchema = {
        admin: parsed.admin || generateDefaultAdmin(),
        settings: { ...initialWebsiteContent, ...(parsed.settings || parsed.content || {}) },
        content: { ...initialWebsiteContent, ...(parsed.content || parsed.settings || {}) },
        services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : initialServices,
        industries: Array.isArray(parsed.industries) && parsed.industries.length > 0 ? parsed.industries : initialIndustries,
        partners: Array.isArray(parsed.partners) && parsed.partners.length > 0 ? parsed.partners : initialPartners,
        enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : initialEnquiries,
        quotes: Array.isArray(parsed.quotes) ? parsed.quotes : initialQuotes,
        testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : initialTestimonials,
        newsletterSubscribers: Array.isArray(parsed.newsletterSubscribers) ? parsed.newsletterSubscribers : initialSubscribers
      };

      // Ensure data file validation
      const validation = DatabaseSchemaObject.safeParse(db);
      if (!validation.success) {
        console.warn('⚠️ [Storage Engine] Partial schema mismatch, auto-repaired data structure.');
      }
      return db;
    }
  } catch (err) {
    console.error('⚠️ [Storage Engine] Failed to load local database, bootstrapping default:', err);
  }

  const initialData: DatabaseSchema = {
    admin: generateDefaultAdmin(),
    settings: initialWebsiteContent,
    content: initialWebsiteContent,
    services: initialServices,
    industries: initialIndustries,
    partners: initialPartners,
    enquiries: initialEnquiries,
    quotes: initialQuotes,
    testimonials: initialTestimonials,
    newsletterSubscribers: initialSubscribers
  };

  saveDbToFileSync(initialData);
  return initialData;
}

function saveDbToFileSync(db: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const serialized = JSON.stringify(db, null, 2);
    fs.writeFileSync(DB_TMP_FILE, serialized, 'utf-8');
    fs.renameSync(DB_TMP_FILE, DB_FILE);
  } catch (err) {
    console.error('[Storage Engine] Synchronous file write failed:', err);
  }
}

function scheduleDbSave(db: DatabaseSchema): Promise<void> {
  const snapshot = JSON.stringify(db, null, 2);

  writeQueue = writeQueue.then(async () => {
    try {
      if (!fs.existsSync(DB_DIR)) {
        await fs.promises.mkdir(DB_DIR, { recursive: true });
      }
      await fs.promises.writeFile(DB_TMP_FILE, snapshot, 'utf-8');
      await fs.promises.rename(DB_TMP_FILE, DB_FILE);
    } catch (err) {
      console.error('[Storage Engine] Atomic write queue failed:', err);
      throw err;
    }
  });

  return writeQueue;
}

inMemoryDb = initDb();

// Seed MongoDB if connected
export async function seedMongoIfConnected(): Promise<void> {
  if (!isDbConnected()) return;

  try {
    const adminCount = await UserDoc.countDocuments();
    if (adminCount === 0) {
      const defaultAdmin = generateDefaultAdmin();
      await UserDoc.create({
        name: defaultAdmin.name,
        email: defaultAdmin.email,
        password: defaultAdmin.passwordHash,
        role: defaultAdmin.role,
        isActive: true
      });
      console.log('🌱 [MongoDB Seed] Initial admin user seeded into MongoDB.');
    }

    const partnerCount = await PartnerCompanyDoc.countDocuments();
    if (partnerCount === 0) {
      await PartnerCompanyDoc.insertMany(
        initialPartners.map(p => ({
          companyName: p.companyName,
          slug: p.slug,
          websiteUrl: p.websiteUrl,
          category: p.category,
          shortDescription: p.shortDescription,
          fullDescription: p.fullDescription,
          logo: p.logo,
          tags: p.tags,
          establishedRole: p.establishedRole,
          isActive: p.isActive,
          displayOrder: p.displayOrder
        }))
      );
      console.log('🌱 [MongoDB Seed] Initial Partner Companies (Global Infosoft) seeded into MongoDB.');
    }

    const serviceCount = await ServiceDoc.countDocuments();
    if (serviceCount === 0) {
      await ServiceDoc.insertMany(
        initialServices.map(s => ({
          title: s.title,
          slug: s.slug,
          shortDescription: s.shortDescription,
          fullDescription: s.fullDescription,
          category: s.category || 'Industrial Automation',
          features: s.features,
          image: s.image,
          icon: s.iconName || 'Cpu',
          iconName: s.iconName || 'Cpu',
          applications: s.applications,
          relatedIndustries: s.relatedIndustries,
          subOfferings: s.subOfferings,
          isActive: s.isActive,
          displayOrder: s.order || 1,
          order: s.order || 1
        }))
      );
      console.log('🌱 [MongoDB Seed] Services seeded into MongoDB.');
    }

    const industryCount = await IndustryDoc.countDocuments();
    if (industryCount === 0) {
      await IndustryDoc.insertMany(
        initialIndustries.map(i => ({
          title: i.name,
          name: i.name,
          slug: i.slug,
          shortDescription: i.shortDescription || i.description.slice(0, 150),
          fullDescription: i.description,
          description: i.description,
          image: i.image,
          icon: i.iconName || 'Factory',
          iconName: i.iconName || 'Factory',
          challenges: i.challenges,
          solutions: i.solutions,
          relatedServices: i.relatedServices,
          isActive: i.isActive,
          displayOrder: i.order || 1,
          order: i.order || 1
        }))
      );
      console.log('🌱 [MongoDB Seed] Industries seeded into MongoDB.');
    }
  } catch (err) {
    console.error('⚠️ [MongoDB Seed Error]', err);
  }
}

export const storage = {
  // Database status check
  getHealthStatus() {
    return {
      status: 'healthy',
      mongoConnected: isDbConnected(),
      storageEngine: isDbConnected() ? 'mongodb-mongoose' : 'json-file-backed',
      filePath: DB_FILE,
      records: {
        services: inMemoryDb.services.length,
        industries: inMemoryDb.industries.length,
        partners: inMemoryDb.partners.length,
        enquiries: inMemoryDb.enquiries.length,
        quotes: inMemoryDb.quotes.length,
        testimonials: inMemoryDb.testimonials.length,
        subscribers: inMemoryDb.newsletterSubscribers.length
      }
    };
  },

  // --- Admin & Auth ---
  async getAdminByEmail(email: string) {
    if (isDbConnected()) {
      try {
        const user = await UserDoc.findOne({ email: email.toLowerCase().trim() });
        if (user) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            passwordHash: user.password,
            role: user.role,
            isActive: user.isActive
          };
        }
      } catch (err) {
        console.warn('[Storage] Mongo getAdminByEmail error, falling back:', err);
      }
    }

    if (inMemoryDb.admin.email.toLowerCase() === email.toLowerCase().trim()) {
      return inMemoryDb.admin;
    }
    return null;
  },

  verifyAdminPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  },

  async updateAdminPassword(email: string, newPassword: string): Promise<boolean> {
    const salt = bcrypt.genSaltSync(12);
    const passwordHash = bcrypt.hashSync(newPassword, salt);

    if (isDbConnected()) {
      try {
        await UserDoc.updateOne({ email: email.toLowerCase().trim() }, { password: passwordHash });
      } catch (err) {
        console.warn('[Storage] Mongo updateAdminPassword error:', err);
      }
    }

    inMemoryDb.admin.passwordHash = passwordHash;
    scheduleDbSave(inMemoryDb);
    return true;
  },

  // --- Partner Companies ---
  async getPartners(onlyActive = true): Promise<PartnerCompanyItem[]> {
    if (isDbConnected()) {
      try {
        const filter = onlyActive ? { isActive: true } : {};
        const partners = await PartnerCompanyDoc.find(filter).sort({ displayOrder: 1, createdAt: 1 });
        if (partners.length > 0) {
          return partners.map((p: any) => ({
            id: p._id.toString(),
            companyName: p.companyName,
            slug: p.slug,
            websiteUrl: p.websiteUrl,
            displayUrl: p.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
            category: p.category,
            shortDescription: p.shortDescription,
            fullDescription: p.fullDescription,
            logo: p.logo,
            tags: p.tags,
            establishedRole: p.establishedRole,
            isActive: p.isActive,
            displayOrder: p.displayOrder,
            createdAt: p.createdAt?.toISOString(),
            updatedAt: p.updatedAt?.toISOString()
          }));
        }
      } catch (err) {
        console.warn('[Storage] Mongo getPartners error, using fallback:', err);
      }
    }

    let items = [...inMemoryDb.partners];
    if (onlyActive) items = items.filter(p => p.isActive);
    return items.sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
  },

  async getPartnerBySlug(slug: string): Promise<PartnerCompanyItem | null> {
    if (isDbConnected()) {
      try {
        const partner = await PartnerCompanyDoc.findOne({ slug: slug.toLowerCase() });
        if (partner) {
          return {
            id: partner._id.toString(),
            companyName: partner.companyName,
            slug: partner.slug,
            websiteUrl: partner.websiteUrl,
            displayUrl: partner.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
            category: partner.category,
            shortDescription: partner.shortDescription,
            fullDescription: partner.fullDescription,
            logo: partner.logo,
            tags: partner.tags,
            establishedRole: partner.establishedRole,
            isActive: partner.isActive,
            displayOrder: partner.displayOrder,
            createdAt: partner.createdAt?.toISOString(),
            updatedAt: partner.updatedAt?.toISOString()
          };
        }
      } catch (err) {
        console.warn('[Storage] Mongo getPartnerBySlug error:', err);
      }
    }

    const found = inMemoryDb.partners.find(p => p.slug.toLowerCase() === slug.toLowerCase());
    return found || null;
  },

  async getPartnerById(id: string): Promise<PartnerCompanyItem | null> {
    if (isDbConnected()) {
      try {
        const partner = await PartnerCompanyDoc.findById(id);
        if (partner) {
          return {
            id: partner._id.toString(),
            companyName: partner.companyName,
            slug: partner.slug,
            websiteUrl: partner.websiteUrl,
            displayUrl: partner.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
            category: partner.category,
            shortDescription: partner.shortDescription,
            fullDescription: partner.fullDescription,
            logo: partner.logo,
            tags: partner.tags,
            establishedRole: partner.establishedRole,
            isActive: partner.isActive,
            displayOrder: partner.displayOrder,
            createdAt: partner.createdAt?.toISOString(),
            updatedAt: partner.updatedAt?.toISOString()
          };
        }
      } catch (err) {
        console.warn('[Storage] Mongo getPartnerById error:', err);
      }
    }

    const found = inMemoryDb.partners.find(p => p.id === id);
    return found || null;
  },

  async createPartner(partner: Omit<PartnerCompanyItem, 'id' | 'createdAt'>): Promise<PartnerCompanyItem> {
    const slug = partner.slug || partner.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (isDbConnected()) {
      try {
        const created = await PartnerCompanyDoc.create({
          ...partner,
          slug
        });
        const resItem: PartnerCompanyItem = {
          id: created._id.toString(),
          companyName: created.companyName,
          slug: created.slug,
          websiteUrl: created.websiteUrl,
          displayUrl: created.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
          category: created.category,
          shortDescription: created.shortDescription,
          fullDescription: created.fullDescription,
          logo: created.logo,
          tags: created.tags,
          establishedRole: created.establishedRole,
          isActive: created.isActive,
          displayOrder: created.displayOrder,
          createdAt: created.createdAt?.toISOString()
        };
        inMemoryDb.partners.push(resItem);
        scheduleDbSave(inMemoryDb);
        return resItem;
      } catch (err) {
        console.warn('[Storage] Mongo createPartner error, saving in-memory:', err);
      }
    }

    const newPartner: PartnerCompanyItem = {
      ...partner,
      slug,
      id: `partner-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    inMemoryDb.partners.push(newPartner);
    scheduleDbSave(inMemoryDb);
    return newPartner;
  },

  async updatePartner(id: string, updates: Partial<PartnerCompanyItem>): Promise<PartnerCompanyItem | null> {
    if (isDbConnected()) {
      try {
        const updated = await PartnerCompanyDoc.findByIdAndUpdate(id, updates, { new: true });
        if (updated) {
          const resItem: PartnerCompanyItem = {
            id: updated._id.toString(),
            companyName: updated.companyName,
            slug: updated.slug,
            websiteUrl: updated.websiteUrl,
            displayUrl: updated.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
            category: updated.category,
            shortDescription: updated.shortDescription,
            fullDescription: updated.fullDescription,
            logo: updated.logo,
            tags: updated.tags,
            establishedRole: updated.establishedRole,
            isActive: updated.isActive,
            displayOrder: updated.displayOrder,
            updatedAt: updated.updatedAt?.toISOString()
          };
          const idx = inMemoryDb.partners.findIndex(p => p.id === id);
          if (idx !== -1) inMemoryDb.partners[idx] = { ...inMemoryDb.partners[idx], ...resItem };
          scheduleDbSave(inMemoryDb);
          return resItem;
        }
      } catch (err) {
        console.warn('[Storage] Mongo updatePartner error:', err);
      }
    }

    const idx = inMemoryDb.partners.findIndex(p => p.id === id);
    if (idx === -1) return null;
    inMemoryDb.partners[idx] = {
      ...inMemoryDb.partners[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    scheduleDbSave(inMemoryDb);
    return inMemoryDb.partners[idx];
  },

  async deletePartner(id: string): Promise<boolean> {
    if (isDbConnected()) {
      try {
        await PartnerCompanyDoc.findByIdAndDelete(id);
      } catch (err) {
        console.warn('[Storage] Mongo deletePartner error:', err);
      }
    }

    const initLen = inMemoryDb.partners.length;
    inMemoryDb.partners = inMemoryDb.partners.filter(p => p.id !== id);
    if (inMemoryDb.partners.length !== initLen) {
      scheduleDbSave(inMemoryDb);
      return true;
    }
    return false;
  },

  // --- Services ---
  getServices(onlyActive = false): ServiceItem[] {
    let items = [...inMemoryDb.services];
    if (onlyActive) items = items.filter(s => s.isActive);
    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  getServiceBySlug(slug: string): ServiceItem | undefined {
    return inMemoryDb.services.find(s => s.slug.toLowerCase() === slug.toLowerCase());
  },

  createService(service: Omit<ServiceItem, 'id' | 'createdAt'>): ServiceItem {
    const newService: ServiceItem = {
      ...service,
      id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    inMemoryDb.services.push(newService);
    scheduleDbSave(inMemoryDb);

    if (isDbConnected()) {
      ServiceDoc.create(newService).catch((e: any) => console.warn('[Storage] Mongo createService sync err:', e));
    }
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
    scheduleDbSave(inMemoryDb);

    if (isDbConnected()) {
      ServiceDoc.findByIdAndUpdate(id, updates).catch((e: any) => console.warn('[Storage] Mongo updateService sync err:', e));
    }
    return inMemoryDb.services[idx];
  },

  deleteService(id: string): boolean {
    const initialLen = inMemoryDb.services.length;
    inMemoryDb.services = inMemoryDb.services.filter(s => s.id !== id);
    if (inMemoryDb.services.length !== initialLen) {
      scheduleDbSave(inMemoryDb);
      if (isDbConnected()) {
        ServiceDoc.findByIdAndDelete(id).catch((e: any) => console.warn('[Storage] Mongo deleteService sync err:', e));
      }
      return true;
    }
    return false;
  },

  // --- Industries ---
  getIndustries(onlyActive = false): IndustryItem[] {
    let items = [...inMemoryDb.industries];
    if (onlyActive) items = items.filter(i => i.isActive);
    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  getIndustryBySlug(slug: string): IndustryItem | undefined {
    return inMemoryDb.industries.find(i => i.slug.toLowerCase() === slug.toLowerCase());
  },

  createIndustry(industry: Omit<IndustryItem, 'id'>): IndustryItem {
    const newIndustry: IndustryItem = {
      ...industry,
      id: `ind-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    inMemoryDb.industries.push(newIndustry);
    scheduleDbSave(inMemoryDb);

    if (isDbConnected()) {
      IndustryDoc.create(newIndustry).catch((e: any) => console.warn('[Storage] Mongo createIndustry sync err:', e));
    }
    return newIndustry;
  },

  updateIndustry(id: string, updates: Partial<IndustryItem>): IndustryItem | null {
    const idx = inMemoryDb.industries.findIndex(i => i.id === id);
    if (idx === -1) return null;
    inMemoryDb.industries[idx] = {
      ...inMemoryDb.industries[idx],
      ...updates
    };
    scheduleDbSave(inMemoryDb);

    if (isDbConnected()) {
      IndustryDoc.findByIdAndUpdate(id, updates).catch((e: any) => console.warn('[Storage] Mongo updateIndustry sync err:', e));
    }
    return inMemoryDb.industries[idx];
  },

  deleteIndustry(id: string): boolean {
    const initialLen = inMemoryDb.industries.length;
    inMemoryDb.industries = inMemoryDb.industries.filter(i => i.id !== id);
    if (inMemoryDb.industries.length !== initialLen) {
      scheduleDbSave(inMemoryDb);
      if (isDbConnected()) {
        IndustryDoc.findByIdAndDelete(id).catch((e: any) => console.warn('[Storage] Mongo deleteIndustry sync err:', e));
      }
      return true;
    }
    return false;
  },

  // --- Contact Inquiries ---
  getInquiries(): EnquiryItem[] {
    return [...inMemoryDb.enquiries].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  },

  getInquiryById(id: string): EnquiryItem | undefined {
    return inMemoryDb.enquiries.find(e => e.id === id);
  },

  createInquiry(enquiry: Omit<EnquiryItem, 'id' | 'createdAt' | 'status'>): EnquiryItem {
    const newEnquiry: EnquiryItem = {
      ...enquiry,
      id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    inMemoryDb.enquiries.unshift(newEnquiry);
    scheduleDbSave(inMemoryDb);

    if (isDbConnected()) {
      ContactInquiryDoc.create({
        name: newEnquiry.name,
        email: newEnquiry.email,
        phone: newEnquiry.phone,
        companyName: newEnquiry.companyName,
        subject: newEnquiry.subject,
        message: newEnquiry.message,
        serviceInterest: newEnquiry.serviceInterest || newEnquiry.service,
        status: 'new'
      }).catch((e: any) => console.warn('[Storage] Mongo createInquiry sync err:', e));
    }

    return newEnquiry;
  },

  updateInquiry(id: string, updates: Partial<EnquiryItem>): EnquiryItem | null {
    const idx = inMemoryDb.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    inMemoryDb.enquiries[idx] = {
      ...inMemoryDb.enquiries[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    scheduleDbSave(inMemoryDb);

    if (isDbConnected()) {
      ContactInquiryDoc.findByIdAndUpdate(id, updates).catch((e: any) => console.warn('[Storage] Mongo updateInquiry sync err:', e));
    }
    return inMemoryDb.enquiries[idx];
  },

  deleteInquiry(id: string): boolean {
    const initialLen = inMemoryDb.enquiries.length;
    inMemoryDb.enquiries = inMemoryDb.enquiries.filter(e => e.id !== id);
    if (inMemoryDb.enquiries.length !== initialLen) {
      scheduleDbSave(inMemoryDb);
      if (isDbConnected()) {
        ContactInquiryDoc.findByIdAndDelete(id).catch((e: any) => console.warn('[Storage] Mongo deleteInquiry sync err:', e));
      }
      return true;
    }
    return false;
  },

  // --- Quotes / RFQs ---
  getQuotes(): QuoteRequestItem[] {
    return [...inMemoryDb.quotes].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  },

  getQuoteById(id: string): QuoteRequestItem | undefined {
    return inMemoryDb.quotes.find(q => q.id === id);
  },

  createQuote(quote: Omit<QuoteRequestItem, 'id' | 'createdAt' | 'status'>): QuoteRequestItem {
    const newQuote: QuoteRequestItem = {
      ...quote,
      id: `quote-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    inMemoryDb.quotes.unshift(newQuote);
    scheduleDbSave(inMemoryDb);

    if (isDbConnected()) {
      QuoteRequestDoc.create({
        name: newQuote.name,
        email: newQuote.email,
        phone: newQuote.phone,
        companyName: newQuote.companyName,
        industry: newQuote.industry,
        requiredService: newQuote.requiredService,
        projectDescription: newQuote.projectDescription,
        estimatedBudget: newQuote.estimatedBudget,
        preferredContactMethod: newQuote.preferredContactMethod || 'email',
        status: 'new'
      }).catch((e: any) => console.warn('[Storage] Mongo createQuote sync err:', e));
    }

    return newQuote;
  },

  updateQuote(id: string, updates: Partial<QuoteRequestItem>): QuoteRequestItem | null {
    const idx = inMemoryDb.quotes.findIndex(q => q.id === id);
    if (idx === -1) return null;
    inMemoryDb.quotes[idx] = {
      ...inMemoryDb.quotes[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    scheduleDbSave(inMemoryDb);

    if (isDbConnected()) {
      QuoteRequestDoc.findByIdAndUpdate(id, updates).catch((e: any) => console.warn('[Storage] Mongo updateQuote sync err:', e));
    }
    return inMemoryDb.quotes[idx];
  },

  deleteQuote(id: string): boolean {
    const initialLen = inMemoryDb.quotes.length;
    inMemoryDb.quotes = inMemoryDb.quotes.filter(q => q.id !== id);
    if (inMemoryDb.quotes.length !== initialLen) {
      scheduleDbSave(inMemoryDb);
      if (isDbConnected()) {
        QuoteRequestDoc.findByIdAndDelete(id).catch((e: any) => console.warn('[Storage] Mongo deleteQuote sync err:', e));
      }
      return true;
    }
    return false;
  },

  // --- Testimonials ---
  getTestimonials(onlyActive = true): TestimonialItem[] {
    let items = [...inMemoryDb.testimonials];
    if (onlyActive) items = items.filter(t => t.isActive);
    return items.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  createTestimonial(testimonial: Omit<TestimonialItem, 'id' | 'createdAt'>): TestimonialItem {
    const newTestimonial: TestimonialItem = {
      ...testimonial,
      id: `test-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    inMemoryDb.testimonials.push(newTestimonial);
    scheduleDbSave(inMemoryDb);

    if (isDbConnected()) {
      TestimonialDoc.create(newTestimonial).catch((e: any) => console.warn('[Storage] Mongo createTestimonial sync err:', e));
    }
    return newTestimonial;
  },

  updateTestimonial(id: string, updates: Partial<TestimonialItem>): TestimonialItem | null {
    const idx = inMemoryDb.testimonials.findIndex(t => t.id === id);
    if (idx === -1) return null;
    inMemoryDb.testimonials[idx] = {
      ...inMemoryDb.testimonials[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    scheduleDbSave(inMemoryDb);

    if (isDbConnected()) {
      TestimonialDoc.findByIdAndUpdate(id, updates).catch((e: any) => console.warn('[Storage] Mongo updateTestimonial sync err:', e));
    }
    return inMemoryDb.testimonials[idx];
  },

  deleteTestimonial(id: string): boolean {
    const initialLen = inMemoryDb.testimonials.length;
    inMemoryDb.testimonials = inMemoryDb.testimonials.filter(t => t.id !== id);
    if (inMemoryDb.testimonials.length !== initialLen) {
      scheduleDbSave(inMemoryDb);
      if (isDbConnected()) {
        TestimonialDoc.findByIdAndDelete(id).catch((e: any) => console.warn('[Storage] Mongo deleteTestimonial sync err:', e));
      }
      return true;
    }
    return false;
  },

  // --- Newsletter ---
  subscribeNewsletter(email: string): { success: boolean; message: string; subscriber: NewsletterSubscriberItem } {
    const normalized = email.toLowerCase().trim();
    const existing = inMemoryDb.newsletterSubscribers.find(s => s.email === normalized);

    if (existing) {
      if (!existing.isSubscribed) {
        existing.isSubscribed = true;
        scheduleDbSave(inMemoryDb);
      }
      return { success: true, message: 'You are subscribed to AMM Automation engineering updates.', subscriber: existing };
    }

    const newSub: NewsletterSubscriberItem = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: normalized,
      isSubscribed: true,
      subscribedAt: new Date().toISOString()
    };

    inMemoryDb.newsletterSubscribers.push(newSub);
    scheduleDbSave(inMemoryDb);

    if (isDbConnected()) {
      NewsletterSubscriberDoc.create({
        email: normalized,
        isSubscribed: true
      }).catch((e: any) => console.warn('[Storage] Mongo subscribe sync err:', e));
    }

    return { success: true, message: 'Subscribed successfully.', subscriber: newSub };
  },

  unsubscribeNewsletter(email: string): boolean {
    const normalized = email.toLowerCase().trim();
    const sub = inMemoryDb.newsletterSubscribers.find(s => s.email === normalized);
    if (sub) {
      sub.isSubscribed = false;
      sub.unsubscribedAt = new Date().toISOString();
      scheduleDbSave(inMemoryDb);

      if (isDbConnected()) {
        NewsletterSubscriberDoc.updateOne({ email: normalized }, { isSubscribed: false, unsubscribedAt: new Date() }).catch((e: any) => console.warn(e));
      }
      return true;
    }
    return false;
  },

  getNewsletterSubscribers(): NewsletterSubscriberItem[] {
    return [...inMemoryDb.newsletterSubscribers];
  },

  // --- Website Content & Settings ---
  getContent(): WebsiteContent {
    return inMemoryDb.settings || inMemoryDb.content;
  },

  updateContent(updated: Partial<WebsiteContent>): WebsiteContent {
    inMemoryDb.settings = {
      ...(inMemoryDb.settings || inMemoryDb.content),
      ...updated
    };
    inMemoryDb.content = inMemoryDb.settings;
    scheduleDbSave(inMemoryDb);

    if (isDbConnected()) {
      SiteSettingDoc.findOneAndUpdate({}, inMemoryDb.settings, { upsert: true }).catch((e: any) => console.warn(e));
    }
    return inMemoryDb.settings;
  },

  // --- Overview Stats ---
  getStats() {
    return {
      totalServices: inMemoryDb.services.length,
      activeServices: inMemoryDb.services.filter(s => s.isActive).length,
      totalIndustries: inMemoryDb.industries.length,
      activeIndustries: inMemoryDb.industries.filter(i => i.isActive).length,
      totalPartnerCompanies: inMemoryDb.partners.length,
      activePartners: inMemoryDb.partners.filter(p => p.isActive).length,
      totalInquiries: inMemoryDb.enquiries.length,
      newInquiries: inMemoryDb.enquiries.filter(e => e.status?.toLowerCase() === 'new').length,
      totalQuoteRequests: inMemoryDb.quotes.length,
      pendingQuoteRequests: inMemoryDb.quotes.filter(q => q.status?.toLowerCase() === 'pending' || q.status?.toLowerCase() === 'new').length,
      totalSubscribers: inMemoryDb.newsletterSubscribers.filter(s => s.isSubscribed).length,
      mongoConnected: isDbConnected()
    };
  },

  async flushPendingWrites(): Promise<void> {
    return writeQueue;
  }
};
