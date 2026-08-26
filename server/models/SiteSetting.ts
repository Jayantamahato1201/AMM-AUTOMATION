import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSetting extends Document {
  companyName: string;
  logo?: string;
  companyLogo?: string;
  favicon?: string;
  email: string;
  contactEmail?: string;
  phone: string;
  contactPhone?: string;
  alternatePhone?: string;
  emergencyPhone?: string;
  address: string;
  workingHours: string;
  whatsappNumber?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    instagram?: string;
  };
  googleMapsUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  tagline?: string;
  bannerNotice?: string;
  footerDescription?: string;
  copyrightText?: string;

  // Hero section
  isHeroEnabled?: boolean;
  heroBadge?: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroDescription?: string;
  heroPrimaryBtnText?: string;
  heroPrimaryBtnLink?: string;
  heroSecondaryBtnText?: string;
  heroSecondaryBtnLink?: string;
  heroImage?: string;
  heroBgImage?: string;
  heroImageAlt?: string;

  // About section
  aboutTitle?: string;
  aboutHeading?: string;
  aboutIntro?: string;
  aboutMission?: string;
  aboutVision?: string;
  aboutApproach?: string;
  aboutImage?: string;
  aboutImageSecondary?: string;
  aboutImageAlt?: string;

  // CTA section
  ctaHeading?: string;
  ctaSubheading?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  ctaImage?: string;

  updatedAt: Date;
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    companyName: { type: String, default: 'AMM AUTOMATION' },
    logo: { type: String, default: '/images/amm_logo.jpg' },
    companyLogo: { type: String, default: '/images/amm_logo.jpg' },
    favicon: { type: String, default: '/images/amm_logo.jpg' },
    email: { type: String, default: 'info@ammautomation.com' },
    contactEmail: { type: String, default: 'info@ammautomation.com' },
    phone: { type: String, default: '+91 92046 73578' },
    contactPhone: { type: String, default: '+91 92046 73578' },
    alternatePhone: { type: String, default: '+91 98765 43210' },
    emergencyPhone: { type: String, default: '+91 92046 73578' },
    address: { type: String, default: 'Industrial Growth Centre, Phase-II, Jamshedpur, Jharkhand - 831013, India' },
    workingHours: { type: String, default: 'Mon - Sat: 08:30 - 18:30 (24/7 Breakdown Response)' },
    whatsappNumber: { type: String, default: '+91 92046 73578' },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      facebook: { type: String, default: 'https://facebook.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      instagram: { type: String, default: 'https://instagram.com' }
    },
    googleMapsUrl: { type: String, default: 'https://maps.google.com' },
    metaTitle: { type: String, default: 'AMM AUTOMATION | Turnkey Industrial Automation, PLC SCADA & Rewinding' },
    metaDescription: { type: String, default: 'Certified industrial automation, PLC programming, control panel fabrication, and heavy HT/LT motor rewinding.' },
    metaKeywords: { type: String, default: 'Industrial Automation, PLC Programming, SCADA Systems, Motor Rewinding, Jamshedpur' },
    tagline: { type: String, default: 'Innovate • Automate • Control' },
    bannerNotice: { type: String, default: '24/7 Rapid Emergency Response & Plant Breakdown Service Available' },
    footerDescription: { type: String, default: 'Complete turnkey automation engineering, custom PLC/SCADA control panel integration, and certified high-voltage motor rewinding solutions.' },
    copyrightText: { type: String, default: '© 2026 AMM Automation. All rights reserved.' },

    // Hero section
    isHeroEnabled: { type: Boolean, default: true },
    heroBadge: { type: String, default: 'INDUSTRIAL AUTOMATION & SMART SOLUTIONS' },
    heroHeading: { type: String, default: 'INDUSTRIAL AUTOMATION & SMART SOLUTIONS' },
    heroSubheading: { type: String, default: 'Engineered for Zero Downtime & Maximum Throughput' },
    heroDescription: { type: String, default: 'Reliable partner in process instrumentation, smart Industry 4.0, and plant-ready solutions designed for maximum efficiency and productivity.' },
    heroPrimaryBtnText: { type: String, default: 'Explore Solutions' },
    heroPrimaryBtnLink: { type: String, default: '/solutions' },
    heroSecondaryBtnText: { type: String, default: 'Request Quick Quote' },
    heroSecondaryBtnLink: { type: String, default: '/contact' },
    heroImage: { type: String, default: '/images/plc_control_panel.jpg' },
    heroBgImage: { type: String, default: '/images/hero_automation.jpg' },
    heroImageAlt: { type: String, default: 'Industrial Automation PLC Control Cabinet & Plant Facility' },

    // About section
    aboutTitle: { type: String, default: 'ABOUT AMM AUTOMATION' },
    aboutHeading: { type: String, default: 'Pioneering Industrial Engineering and Plant Reliability Since 2008' },
    aboutIntro: { type: String, default: 'AMM Automation delivers robust, end-to-end industrial control engineering, automation retrofits, and electrical infrastructure support designed to withstand harsh manufacturing environments.' },
    aboutMission: { type: String, default: 'To empower heavy industries and discrete manufacturing plants with uncompromising automation reliability, zero unplanned downtime, and precision control.' },
    aboutVision: { type: String, default: 'To be the most trusted industrial engineering partner in East India, pioneering intelligent manufacturing and Industry 4.0 integration.' },
    aboutApproach: { type: String, default: 'We combine field-proven automation hardware with rigorous standards-compliant engineering, testing, and continuous 24/7 on-call lifecycle support.' },
    aboutImage: { type: String, default: '/images/robotics_smart_plant.jpg' },
    aboutImageSecondary: { type: String, default: '/images/instrumentation_field.jpg' },
    aboutImageAlt: { type: String, default: 'AMM Automation Smart Robotics and Plant Integration' },

    // CTA section
    ctaHeading: { type: String, default: 'Ready to Upgrade Your Industrial Operations?' },
    ctaSubheading: { type: String, default: 'Speak with our senior automation engineers today for a tailored evaluation of your plant infrastructure.' },
    ctaButtonText: { type: String, default: 'Request Consultation & Quote' },
    ctaButtonLink: { type: String, default: '/contact' },
    ctaImage: { type: String, default: '/images/hero_automation.jpg' }
  },
  { timestamps: true }
);

export const SiteSettingModel =
  mongoose.models.SiteSetting || mongoose.model<ISiteSetting>('SiteSetting', SiteSettingSchema);
