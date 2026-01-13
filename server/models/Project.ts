import mongoose, { Schema, Document } from 'mongoose';

export interface ProjectTranslation {
  title: string;
  category: string;
  description?: string;
  client?: string;
  role?: string;
  techStack?: string[];
  applications?: string[];
  timeline?: string;
}

export interface ProjectDocument extends Document {
  slug: string;
  year?: string;
  coverImage?: string;
  galleryImages?: string[];
  isFeatured?: boolean;
  published?: boolean;
  isDeleted?: boolean;
  translations: {
    tr: ProjectTranslation;
    nl: ProjectTranslation;
    en: ProjectTranslation;
  };
  categorySlug?: string;
  updatedAt?: Date;
  createdAt: Date;
}

const ProjectTranslationSchema = new Schema<ProjectTranslation>({
  title: { type: String, required: false },
  category: { type: String, required: false },
  description: String,
  client: String,
  role: String,
  techStack: [String],
  applications: [String],
  timeline: String
}, { _id: false });

const ProjectSchema = new Schema<ProjectDocument>(
  {
    slug: { type: String, required: true, unique: true },
    year: String,
    coverImage: String,
    galleryImages: [String],
    isFeatured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    categorySlug: String,
    translations: {
      tr: { type: ProjectTranslationSchema, required: false },
      nl: { type: ProjectTranslationSchema, required: true },
      en: { type: ProjectTranslationSchema, required: false }
    },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export const ProjectModel = mongoose.models.Project || mongoose.model<ProjectDocument>('Project', ProjectSchema);
