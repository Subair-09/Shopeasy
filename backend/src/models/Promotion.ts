import { Schema, model, Document } from 'mongoose';

export interface IPromotion extends Document {
  code: string;
  description?: string;
  discountPercentage?: number;
  fixedDiscountKobo?: number;
  minOrderValueKobo?: number;
  maxDiscountKobo?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: Date;
}

const PromotionSchema = new Schema<IPromotion>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    discountPercentage: { type: Number, min: 1, max: 100 },
    fixedDiscountKobo: { type: Number, min: 0 },
    minOrderValueKobo: { type: Number, default: 0 },
    maxDiscountKobo: { type: Number },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export const Promotion = model<IPromotion>('Promotion', PromotionSchema);
