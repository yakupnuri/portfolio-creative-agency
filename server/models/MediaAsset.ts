import mongoose, { Schema, Document } from 'mongoose';

export interface MediaAssetDocument extends Document {
  source: 'upload' | 'pixabay';
  storage: 'cloudinary' | 'local';
  url: string;
  preview?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  tags?: string[];
  cloudinary_public_id?: string;
  local_path?: string;
  createdAt: Date;
}

const MediaAssetSchema = new Schema<MediaAssetDocument>({
  source: { type: String, enum: ['upload', 'pixabay'], required: true },
  storage: { type: String, enum: ['cloudinary', 'local'], required: true },
  url: { type: String, required: true },
  preview: { type: String },
  format: { type: String },
  bytes: { type: Number },
  width: { type: Number },
  height: { type: Number },
  alt: { type: String },
  caption: { type: String },
  tags: { type: [String], default: [] },
  cloudinary_public_id: { type: String },
  local_path: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

export const MediaAssetModel = mongoose.models.MediaAsset || mongoose.model<MediaAssetDocument>('MediaAsset', MediaAssetSchema);

