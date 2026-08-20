import mongoose, { Schema, Document } from 'mongoose';

export interface IIndustry extends Document {
  title: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  description: string;
  image: string;
  icon: string;
  iconName?: string;
  challenges: string[];
  solutions: string[];
  relatedServices: string[];
  isActive: boolean;
  displayOrder: number;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const IndustrySchema = new Schema<IIndustry>(
  {
    title: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, default: '/images/metal_plant.jpg' },
    icon: { type: String, default: 'Factory' },
    iconName: { type: String, default: 'Factory' },
    challenges: [{ type: String, trim: true }],
    solutions: [{ type: String, trim: true }],
    relatedServices: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const IndustryModel = mongoose.models.Industry || mongoose.model<IIndustry>('Industry', IndustrySchema);
