import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category?: string;
  features: string[];
  image: string;
  icon: string;
  iconName?: string;
  applications?: string[];
  relatedIndustries?: string[];
  subOfferings?: string[];
  isActive: boolean;
  displayOrder: number;
  order?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    features: [{ type: String, trim: true }],
    image: { type: String, required: true, default: '/images/hero_automation.jpg' },
    icon: { type: String, default: 'Cpu' },
    iconName: { type: String, default: 'Cpu' },
    applications: [{ type: String, trim: true }],
    relatedIndustries: [{ type: String, trim: true }],
    subOfferings: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true }
  },
  { timestamps: true }
);

export const ServiceModel = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
