export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category?: string;
  image: string;
  iconName: string;
  features: string[];
  applications?: string[];
  relatedIndustries?: string[];
  subOfferings?: string[];
  isActive: boolean;
  order: number;
  displayOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  title?: string;
  slug: string;
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  image: string;
  iconName: string;
  challenges: string[];
  solutions: string[];
  relatedServices: string[];
  isActive: boolean;
  order: number;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnerCompanyItem {
  id: string;
  companyName: string;
  slug: string;
  websiteUrl: string;
  displayUrl?: string;
  category: string;
  shortDescription: string;
  fullDescription?: string;
  logo?: string;
  tags?: string[];
  establishedRole?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EnquiryItem {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  subject?: string;
  service?: string;
  serviceInterest?: string;
  message: string;
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'spam' | 'New' | 'Contacted' | 'In Discussion' | 'Closed' | string;
  adminNotes?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuoteRequestItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  industry?: string;
  requiredService: string;
  projectDescription: string;
  estimatedBudget?: string;
  preferredContactMethod?: 'email' | 'phone' | 'whatsapp';
  status: 'new' | 'reviewing' | 'contacted' | 'quoted' | 'completed' | 'rejected' | 'Pending' | 'Reviewing' | 'Estimated' | 'Accepted' | 'Declined' | string;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  company: string;
  designation?: string;
  testimonial: string;
  rating: number;
  image?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsletterSubscriberItem {
  id: string;
  email: string;
  isSubscribed: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

export interface WebsiteContent {
  companyName?: string;
  companyDescription?: string;
  tagline?: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroDescription?: string;
  aboutIntro?: string;
  aboutMission?: string;
  aboutVision?: string;
  aboutApproach?: string;
  ctaHeading?: string;
  ctaSubheading?: string;
  contactEmail?: string;
  contactPhone?: string;
  alternatePhone?: string;
  whatsappNumber?: string;
  address?: string;
  workingHours?: string;
  bannerNotice?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
  };
  googleMapsUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
}
