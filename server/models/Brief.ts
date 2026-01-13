import mongoose, { Schema, Document } from 'mongoose';

export interface BriefDocument extends Document {
  serviceType: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  budgetRange?: string;
  deadline?: string;
  message?: string;
  serviceSpecificData?: Record<string, unknown>;
  status?: 'new' | 'reviewing' | 'proposal_sent' | 'won' | 'lost';
  internalNotes?: string;
  tags?: string[];
  createdAt: Date;
}

const BriefSchema = new Schema<BriefDocument>(
  {
    serviceType: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    budgetRange: String,
    deadline: String,
    message: String,
    serviceSpecificData: {},
    status: { type: String, default: 'new' },
    internalNotes: String,
    tags: [String],
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export const BriefModel = mongoose.models.Brief || mongoose.model<BriefDocument>('Brief', BriefSchema);
