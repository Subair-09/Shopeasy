import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string; // Category slug or ID
  subcategory?: string;
  regularPriceKobo: number; // e.g. ₦32,000 = 3200000 kobo
  discountedPriceKobo: number; // e.g. ₦25,000 = 2500000 kobo
  priceKobo?: number;
  price?: number;
  originalPrice?: number;
  image?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  lowStockThreshold: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  salesCount: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    category: { type: String, required: true, lowercase: true },
    subcategory: { type: String, default: '' },
    regularPriceKobo: { type: Number, required: true, min: 0 },
    discountedPriceKobo: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    salesCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.pre<IProduct>('validate', function (next) {
  if (!this.slug && this.name) {
    const cleanName = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    this.slug = `${cleanName}-${this.sku ? this.sku.toLowerCase() : Math.random().toString(36).substring(2, 6)}`;
  }
  if (!this.regularPriceKobo && (this as any).priceKobo) {
    this.regularPriceKobo = (this as any).priceKobo;
  }
  if (!this.discountedPriceKobo && this.regularPriceKobo) {
    this.discountedPriceKobo = this.regularPriceKobo;
  }
  next();
});

ProductSchema.virtual('priceKobo').get(function () {
  return this.discountedPriceKobo || this.regularPriceKobo;
});

// Virtual for price in Naira
ProductSchema.virtual('price').get(function () {
  return Math.round(this.discountedPriceKobo / 100);
});

ProductSchema.virtual('originalPrice').get(function () {
  return Math.round(this.regularPriceKobo / 100);
});

ProductSchema.virtual('image').get(function () {
  return this.images && this.images.length > 0
    ? this.images[0]
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
});

export const Product = model<IProduct>('Product', ProductSchema);
