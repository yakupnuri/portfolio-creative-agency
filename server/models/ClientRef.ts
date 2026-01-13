import mongoose, { Schema, Document } from 'mongoose';

export interface ClientRefDocument extends Document {
  name: string;
  logoUrl?: string;
  order?: number;
  published?: boolean;
  createdAt: Date;
}

const ClientRefSchema = new Schema<ClientRefDocument>(
  {
    name: { type: String, required: true },
    logoUrl: String,
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export const ClientRefModel = mongoose.models.ClientRef || mongoose.model<ClientRefDocument>('ClientRef', ClientRefSchema);
