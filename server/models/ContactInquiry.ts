import mongoose, { Schema, Document } from 'mongoose';

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  subject?: string;
  message: string;
  serviceInterest?: string;
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'spam';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    serviceInterest: { type: String, trim: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in-progress', 'completed', 'spam'],
      default: 'new'
    },
    adminNotes: { type: String, trim: true }
  },
  { timestamps: true }
);

export const ContactInquiryModel =
  mongoose.models.ContactInquiry || mongoose.model<IContactInquiry>('ContactInquiry', ContactInquirySchema);
