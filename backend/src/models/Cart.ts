import { Schema, model, Document, Types } from 'mongoose';

export interface ICartItem {
  _id?: Types.ObjectId | string;
  productId?: Schema.Types.ObjectId | string;
  product?: any;
  quantity: number;
  priceKobo?: number;
  selectedColor?: string;
  selectedSize?: string;
  selected?: boolean;
}

export interface ICart extends Document {
  customerId?: Schema.Types.ObjectId | string;
  customer?: Schema.Types.ObjectId | string;
  items: Types.DocumentArray<any>;
  appliedPromoCode?: string;
  subtotalKobo?: number;
  shippingFeeKobo?: number;
  discountKobo?: number;
  totalKobo?: number;
}

const CartSchema = new Schema<ICart>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        priceKobo: { type: Number, default: 0 },
        selectedColor: { type: String },
        selectedSize: { type: String },
        selected: { type: Boolean, default: true },
      },
    ],
    appliedPromoCode: { type: String, default: null },
    subtotalKobo: { type: Number, default: 0 },
    shippingFeeKobo: { type: Number, default: 200000 },
    discountKobo: { type: Number, default: 0 },
    totalKobo: { type: Number, default: 200000 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CartSchema.pre<ICart>('save', function (next) {
  if (!this.customerId && this.customer) this.customerId = this.customer;
  if (!this.customer && this.customerId) this.customer = this.customerId;
  this.items.forEach((item: any) => {
    if (!item.productId && item.product) item.productId = item.product;
    if (!item.product && item.productId) item.product = item.productId;
  });
  next();
});

export const Cart = model<ICart>('Cart', CartSchema);
