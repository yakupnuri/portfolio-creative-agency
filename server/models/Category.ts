import mongoose, { Schema, Document } from 'mongoose';

export interface CategoryTranslation {
  name: string;
}

export interface CategoryDocument extends Document {
  slug: string;
  isActive?: boolean;
  order?: number;
  translations: {
    tr: CategoryTranslation;
    nl: CategoryTranslation;
    en: CategoryTranslation;
  };
  updatedAt?: Date;
  createdAt: Date;
}

const CategoryTranslationSchema = new Schema<CategoryTranslation>({
  name: { type: String, required: false }
}, { _id: false });

const CategorySchema = new Schema<CategoryDocument>(
  {
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    translations: {
      tr: { type: CategoryTranslationSchema, required: false },
      nl: { type: CategoryTranslationSchema, required: true },
      en: { type: CategoryTranslationSchema, required: false }
    },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export const CategoryModel = mongoose.models.Category || mongoose.model<CategoryDocument>('Category', CategorySchema);
