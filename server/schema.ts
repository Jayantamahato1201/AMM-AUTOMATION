import { z } from 'zod';

// Utility helper to sanitize strings and strip HTML / script tags
export const sanitizeString = (val: string): string => {
  if (typeof val !== 'string') return '';
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
};

export const sanitizeArray = (arr?: string[]): string[] => {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => sanitizeString(item));
};

// --- Service Schema ---
export const ServiceSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  shortDescription: z.string().min(1).max(1000),
  fullDescription: z.string().min(1).max(10000),
  category: z.string().max(100).optional(),
  image: z.string().max(1000).default('/images/hero_automation.jpg'),
  iconName: z.string().max(100).default('Cpu'),
  icon: z.string().max(100).optional(),
  features: z.array(z.string()).default([]),
  applications: z.array(z.string()).default([]),
  relatedIndustries: z.array(z.string()).default([]),
  subOfferings: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().default(99),
  displayOrder: z.number().int().optional(),
  seoTitle: z.string().max(300).optional(),
  seoDescription: z.string().max(500).optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional()
});

export const CreateServiceInputSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  shortDescription: z.string().min(5).max(1000),
  fullDescription: z.string().max(10000).optional(),
  category: z.string().max(100).optional(),
  image: z.string().max(1000).optional(),
  iconName: z.string().max(100).optional(),
  icon: z.string().max(100).optional(),
  features: z.array(z.string()).optional().default([]),
  applications: z.array(z.string()).optional().default([]),
  relatedIndustries: z.array(z.string()).optional().default([]),
  subOfferings: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
  order: z.number().int().optional().default(99),
  displayOrder: z.number().int().optional(),
  seoTitle: z.string().max(300).optional(),
  seoDescription: z.string().max(500).optional()
});

export const UpdateServiceInputSchema = CreateServiceInputSchema.partial();

// --- Industry Schema ---
export const IndustrySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  title: z.string().max(200).optional(),
  slug: z.string().min(1).max(200),
  description: z.string().min(1).max(10000),
  shortDescription: z.string().max(1000).optional(),
  fullDescription: z.string().max(10000).optional(),
  image: z.string().max(1000).default('/images/metal_plant.jpg'),
  iconName: z.string().max(100).default('Factory'),
  icon: z.string().max(100).optional(),
  challenges: z.array(z.string()).default([]),
  solutions: z.array(z.string()).default([]),
  relatedServices: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  order: z.number().int().default(99),
  displayOrder: z.number().int().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const CreateIndustryInputSchema = z.object({
  name: z.string().min(2).max(200),
  title: z.string().max(200).optional(),
  slug: z.string().min(2).max(200),
  description: z.string().min(5).max(10000),
  shortDescription: z.string().max(1000).optional(),
  fullDescription: z.string().max(10000).optional(),
  image: z.string().max(1000).optional(),
  iconName: z.string().max(100).optional(),
  icon: z.string().max(100).optional(),
  challenges: z.array(z.string()).optional().default([]),
  solutions: z.array(z.string()).optional().default([]),
  relatedServices: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
  order: z.number().int().optional().default(99),
  displayOrder: z.number().int().optional()
});

export const UpdateIndustryInputSchema = CreateIndustryInputSchema.partial();

// --- Partner Companies Schema ---
export const PartnerCompanySchema = z.object({
  id: z.string(),
  companyName: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  websiteUrl: z.string().url('Please enter a valid website URL'),
  displayUrl: z.string().optional(),
  category: z.string().min(2).max(200),
  shortDescription: z.string().min(5).max(2000),
  fullDescription: z.string().max(10000).optional(),
  logo: z.string().max(1000).optional(),
  tags: z.array(z.string()).default([]),
  establishedRole: z.string().max(200).optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(1),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const CreatePartnerCompanyInputSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters').max(200),
  slug: z.string().min(2).max(200).optional(),
  websiteUrl: z.string().url('Please enter a valid URL (e.g. https://globalinfosoft.com)'),
  displayUrl: z.string().optional(),
  category: z.string().min(2, 'Category is required').max(200),
  shortDescription: z.string().min(5, 'Short description is required').max(2000),
  fullDescription: z.string().max(10000).optional(),
  logo: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional().default([]),
  establishedRole: z.string().max(200).optional(),
  isActive: z.boolean().optional().default(true),
  displayOrder: z.number().int().optional().default(1)
});

export const UpdatePartnerCompanyInputSchema = CreatePartnerCompanyInputSchema.partial();

// --- Contact Inquiry Schema ---
export const ContactInquirySchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  companyName: z.string().max(150).optional(),
  email: z.string().trim().email('Invalid email address').max(200),
  phone: z.string().min(7).max(30),
  subject: z.string().max(200).optional(),
  service: z.string().max(200).optional(),
  serviceInterest: z.string().max(200).optional(),
  message: z.string().min(5).max(5000),
  status: z.enum(['new', 'contacted', 'in-progress', 'completed', 'spam', 'New', 'Contacted', 'In Discussion', 'Closed']).default('new'),
  adminNotes: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional()
});

export const CreateContactInquiryInputSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  companyName: z.string().max(150).optional(),
  email: z.string().trim().email('Invalid email address').max(200),
  phone: z.string().min(7, 'Phone number must be at least 7 digits').max(30),
  subject: z.string().max(200).optional(),
  service: z.string().max(200).optional(),
  serviceInterest: z.string().max(200).optional(),
  message: z.string().min(5, 'Message must be at least 5 characters').max(5000)
});

export const UpdateContactInquiryInputSchema = z.object({
  status: z.enum(['new', 'contacted', 'in-progress', 'completed', 'spam', 'New', 'Contacted', 'In Discussion', 'Closed']).optional(),
  adminNotes: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional()
});

// --- Quote Request Schema ---
export const QuoteRequestSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  email: z.string().trim().email('Invalid email address').max(200),
  phone: z.string().min(7).max(30),
  companyName: z.string().max(150).optional(),
  industry: z.string().max(150).optional(),
  requiredService: z.string().min(2).max(200),
  projectDescription: z.string().min(5).max(5000),
  estimatedBudget: z.string().max(100).optional(),
  preferredContactMethod: z.enum(['email', 'phone', 'whatsapp']).default('email'),
  status: z.enum(['new', 'reviewing', 'contacted', 'quoted', 'completed', 'rejected']).default('new'),
  adminNotes: z.string().max(2000).optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional()
});

export const CreateQuoteRequestInputSchema = z.object({
  name: z.string().min(2, 'Contact name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(200),
  phone: z.string().min(7, 'Phone number is required').max(30),
  companyName: z.string().max(150).optional(),
  industry: z.string().max(150).optional(),
  requiredService: z.string().min(2, 'Required service must be specified').max(200),
  projectDescription: z.string().min(5, 'Project description is required').max(5000),
  estimatedBudget: z.string().max(100).optional(),
  preferredContactMethod: z.enum(['email', 'phone', 'whatsapp']).optional().default('email')
});

export const UpdateQuoteRequestInputSchema = z.object({
  status: z.enum(['new', 'reviewing', 'contacted', 'quoted', 'completed', 'rejected']).optional(),
  adminNotes: z.string().max(2000).optional()
});

// --- Testimonial Schema ---
export const TestimonialSchema = z.object({
  id: z.string(),
  clientName: z.string().min(2).max(100),
  company: z.string().min(2).max(150),
  designation: z.string().max(100).optional(),
  testimonial: z.string().min(5).max(2000),
  rating: z.number().int().min(1).max(5).default(5),
  image: z.string().max(1000).optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(1),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const CreateTestimonialInputSchema = z.object({
  clientName: z.string().min(2).max(100),
  company: z.string().min(2).max(150),
  designation: z.string().max(100).optional(),
  testimonial: z.string().min(5).max(2000),
  rating: z.number().int().min(1).max(5).optional().default(5),
  image: z.string().max(1000).optional(),
  isActive: z.boolean().optional().default(true),
  displayOrder: z.number().int().optional().default(1)
});

export const UpdateTestimonialInputSchema = CreateTestimonialInputSchema.partial();

// --- Newsletter Subscriber Schema ---
export const NewsletterSubscriberSchema = z.object({
  id: z.string(),
  email: z.string().trim().email('Invalid email address').max(200),
  isSubscribed: z.boolean().default(true),
  subscribedAt: z.string(),
  unsubscribedAt: z.string().optional()
});

export const CreateNewsletterSubscriberInputSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address').max(200)
});

// --- Site Settings Schema ---
export const SiteSettingsSchema = z.object({
  companyName: z.string().max(200).optional(),
  logo: z.string().max(1000).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(50).optional(),
  alternatePhone: z.string().max(50).optional(),
  address: z.string().max(500).optional(),
  workingHours: z.string().max(300).optional(),
  whatsappNumber: z.string().max(50).optional(),
  socialLinks: z.object({
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    youtube: z.string().optional()
  }).optional(),
  googleMapsUrl: z.string().optional(),
  metaTitle: z.string().max(300).optional(),
  metaDescription: z.string().max(500).optional(),
  tagline: z.string().max(300).optional(),
  heroHeading: z.string().max(300).optional(),
  heroSubheading: z.string().max(500).optional(),
  heroDescription: z.string().max(5000).optional(),
  aboutIntro: z.string().max(5000).optional(),
  aboutMission: z.string().max(5000).optional(),
  aboutVision: z.string().max(5000).optional(),
  bannerNotice: z.string().max(500).optional()
});

export const UpdateSiteSettingsInputSchema = SiteSettingsSchema.partial();

// Legacy alias for WebsiteContent
export const WebsiteContentSchema = SiteSettingsSchema;
export const UpdateWebsiteContentInputSchema = UpdateSiteSettingsInputSchema;

// --- Admin Schema ---
export const AdminSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  email: z.string().trim().email(),
  passwordHash: z.string(),
  role: z.enum(['admin', 'superadmin']),
  isActive: z.boolean().optional().default(true),
  lastLogin: z.string().optional()
});

export const AdminLoginInputSchema = z.object({
  email: z.string().trim().email('Please provide a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100)
});

// --- AI Query Schema ---
export const AISolutionQuerySchema = z.object({
  query: z.string().min(5, 'Query must be at least 5 characters').max(1000),
  industry: z.string().max(100).optional(),
  plantType: z.string().max(100).optional()
});

// --- Complete Database File Schema ---
export const DatabaseSchemaObject = z.object({
  admin: AdminSchema,
  settings: SiteSettingsSchema.optional(),
  content: WebsiteContentSchema.optional(),
  services: z.array(ServiceSchema).default([]),
  industries: z.array(IndustrySchema).default([]),
  partners: z.array(PartnerCompanySchema).default([]),
  enquiries: z.array(ContactInquirySchema).default([]),
  quotes: z.array(QuoteRequestSchema).default([]),
  testimonials: z.array(TestimonialSchema).default([]),
  newsletterSubscribers: z.array(NewsletterSubscriberSchema).default([])
});
