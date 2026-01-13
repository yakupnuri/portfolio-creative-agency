import mongoose, { Schema, Document } from 'mongoose';

export interface ContentDocument extends Document {
  key: 'home' | 'about' | 'services' | 'process' | 'contact';
  draft: Record<string, unknown>;
  publishedVersion?: Record<string, unknown>;
  updatedAt: Date;
  createdAt: Date;
}

const ContentSchema = new Schema<ContentDocument>(
  {
    key: { type: String, required: true, unique: true },
    draft: { type: Object, default: {} },
    publishedVersion: { type: Object, default: {} },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export const ContentModel = mongoose.models.Content || mongoose.model<ContentDocument>('Content', ContentSchema);
