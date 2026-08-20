export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  iconName: string;
  features: string[];
  applications: string[];
  relatedIndustries: string[];
  subOfferings?: string[];
  isActive: boolean;
  order: number;
  displayOrder?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  image: string;
  iconName: string;
  challenges: string[];
  solutions: string[];
  relatedServices: string[];
  isActive: boolean;
  order: number;
  displayOrder?: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  featuredImage: string;
  gallery: string[];
  industry: string;
  services: string[];
  technologies: string[];
  status: 'Completed' | 'In Progress' | 'Commissioned';
  clientType?: string;
  location?: string;
  completionYear?: string;
  isFeatured?: boolean;
  createdAt: string;
}

export interface EnquiryItem {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  subject: string;
  service: string;
  message: string;
  status: 'New' | 'Contacted' | 'In Discussion' | 'Closed';
  notes?: string;
  createdAt: string;
}

export interface WebsiteContent {
  companyName?: string;
  companyDescription?: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  heroDescription: string;
  aboutIntro: string;
  aboutMission: string;
  aboutVision: string;
  aboutApproach?: string;
  ctaHeading?: string;
  ctaSubheading?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  workingHours: string;
  bannerNotice?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
}
