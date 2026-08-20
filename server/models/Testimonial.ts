import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  company: string;
  designation?: string;
  testimonial: string;
  rating: number;
  image?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    designation: { type: String, trim: true },
    testimonial: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, default: 5, min: 1, max: 5 },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export const TestimonialModel =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
