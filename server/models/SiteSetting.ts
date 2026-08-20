import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSetting extends Document {
  companyName: string;
  logo?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  workingHours: string;
  whatsappNumber?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
  };
  googleMapsUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  tagline?: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroDescription?: string;
  aboutIntro?: string;
  aboutMission?: string;
  aboutVision?: string;
  updatedAt: Date;
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    companyName: { type: String, default: 'AMM AUTOMATION' },
    logo: { type: String },
    email: { type: String, default: 'info@ammautomation.com' },
    phone: { type: String, default: '+91 98765 43210' },
    alternatePhone: { type: String },
    address: { type: String, default: 'Industrial Growth Centre, Phase-II, Jamshedpur, Jharkhand - 831013, India' },
    workingHours: { type: String, default: 'Mon - Sat: 08:30 - 18:30 (24/7 Breakdown Response)' },
    whatsappNumber: { type: String, default: '+91 98765 43210' },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      facebook: { type: String, default: 'https://facebook.com' },
      youtube: { type: String, default: 'https://youtube.com' }
    },
    googleMapsUrl: { type: String },
    metaTitle: { type: String, default: 'AMM AUTOMATION | Turnkey Industrial Automation, PLC SCADA & Rewinding' },
    metaDescription: { type: String, default: 'Certified industrial automation, PLC programming, control panel fabrication, and heavy HT/LT motor rewinding.' },
    tagline: { type: String, default: 'Precision Engineering & Process Control' },
    heroHeading: { type: String, default: 'TURNKEY INDUSTRIAL AUTOMATION' },
    heroSubheading: { type: String, default: 'Engineered for Zero Downtime & Maximum Throughput' },
    heroDescription: { type: String, default: 'Integrated process automation, custom PLC/SCADA systems, heavy motor rewinding, and HT/LT electrical panels engineered for mission-critical industrial manufacturing.' },
    aboutIntro: { type: String, default: 'AMM Automation delivers robust, end-to-end industrial control engineering, automation retrofits, and electrical infrastructure support.' },
    aboutMission: { type: String, default: 'To empower heavy industries and discrete manufacturing plants with uncompromising automation reliability, zero unplanned downtime, and precision control.' },
    aboutVision: { type: String, default: 'To be the most trusted industrial engineering partner in East India, pioneering intelligent manufacturing and Industry 4.0 integration.' }
  },
  { timestamps: true }
);

export const SiteSettingModel =
  mongoose.models.SiteSetting || mongoose.model<ISiteSetting>('SiteSetting', SiteSettingSchema);
