import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  displayOrder: number;
  productCount: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    icon: { type: String, default: 'apps-outline' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Category = model<ICategory>('Category', CategorySchema);
