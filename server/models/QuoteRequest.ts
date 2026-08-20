import mongoose, { Schema, Document } from 'mongoose';

export interface IQuoteRequest extends Document {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  industry?: string;
  requiredService: string;
  projectDescription: string;
  estimatedBudget?: string;
  preferredContactMethod: 'email' | 'phone' | 'whatsapp';
  status: 'new' | 'reviewing' | 'contacted' | 'quoted' | 'completed' | 'rejected';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteRequestSchema = new Schema<IQuoteRequest>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    industry: { type: String, trim: true },
    requiredService: { type: String, required: true, trim: true },
    projectDescription: { type: String, required: true, trim: true },
    estimatedBudget: { type: String, trim: true },
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'whatsapp'],
      default: 'email'
    },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'contacted', 'quoted', 'completed', 'rejected'],
      default: 'new'
    },
    adminNotes: { type: String, trim: true }
  },
  { timestamps: true }
);

export const QuoteRequestModel =
  mongoose.models.QuoteRequest || mongoose.model<IQuoteRequest>('QuoteRequest', QuoteRequestSchema);
