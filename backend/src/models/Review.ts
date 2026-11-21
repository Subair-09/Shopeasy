import { Schema, model, Document } from 'mongoose';

export interface IReview extends Document {
  productId: Schema.Types.ObjectId | string;
  customerId?: Schema.Types.ObjectId | string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Review = model<IReview>('Review', ReviewSchema);
