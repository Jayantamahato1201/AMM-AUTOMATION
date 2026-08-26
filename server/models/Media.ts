import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  id: string;
  fileName: string;
  publicUrl: string;
  storageIdentifier: string;
  mimeType: string;
  fileSize: number;
  altText?: string;
  relatedSection?: string;
  data?: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    id: { type: String, required: true, unique: true, index: true },
    fileName: { type: String, required: true },
    publicUrl: { type: String, required: true },
    storageIdentifier: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    altText: { type: String, default: '' },
    relatedSection: { type: String, default: 'general' },
    data: { type: Buffer }
  },
  { timestamps: true }
);

export const MediaModel =
  mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
