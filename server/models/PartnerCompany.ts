import mongoose, { Schema, Document } from 'mongoose';

export interface IPartnerCompany extends Document {
  companyName: string;
  slug: string;
  websiteUrl: string;
  category: string;
  shortDescription: string;
  fullDescription?: string;
  logo?: string;
  tags?: string[];
  establishedRole?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerCompanySchema = new Schema<IPartnerCompany>(
  {
    companyName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    websiteUrl: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, trim: true },
    logo: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    establishedRole: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export const PartnerCompanyModel =
  mongoose.models.PartnerCompany || mongoose.model<IPartnerCompany>('PartnerCompany', PartnerCompanySchema);
