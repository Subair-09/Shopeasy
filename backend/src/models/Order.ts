import { Schema, model, Document } from 'mongoose';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface IOrderItem {
  productId?: Schema.Types.ObjectId | string;
  product?: Schema.Types.ObjectId | string;
  name: string;
  sku?: string;
  unitPriceKobo?: number;
  priceKobo?: number;
  quantity: number;
  image?: string;
  selectedColor?: string;
  selectedSize?: string;
  subtotalKobo?: number;
}

export interface IStatusHistory {
  status: string;
  timestamp: Date;
  note?: string;
  changedBy?: string;
  updatedBy?: string;
}

export interface IOrder extends Document {
  orderId: string;
  orderNumber: string;
  customerId?: Schema.Types.ObjectId | string;
  customer?: any;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  subtotalKobo: number;
  deliveryFeeKobo: number;
  shippingFeeKobo: number;
  taxKobo: number;
  discountKobo: number;
  totalKobo: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  orderStatus: OrderStatus;
  deliveryAddress: string;
  shippingAddress?: any;
  trackingNumber: string;
  statusHistory: IStatusHistory[];
  timeline: IStatusHistory[];
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    orderNumber: { type: String, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, default: '' },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        sku: { type: String, default: '' },
        unitPriceKobo: { type: Number, default: 0 },
        priceKobo: { type: Number, default: 0 },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, default: '' },
        selectedColor: { type: String },
        selectedSize: { type: String },
        subtotalKobo: { type: Number, default: 0 },
      },
    ],
    subtotalKobo: { type: Number, required: true },
    deliveryFeeKobo: { type: Number, default: 0 },
    shippingFeeKobo: { type: Number, default: 0 },
    taxKobo: { type: Number, default: 0 },
    discountKobo: { type: Number, default: 0 },
    totalKobo: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Paystack' },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    paymentReference: { type: String, index: true },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
      default: 'Pending',
    },
    deliveryAddress: { type: String, default: '' },
    shippingAddress: { type: Schema.Types.Mixed },
    trackingNumber: { type: String, default: '' },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' },
        changedBy: { type: String, default: 'System' },
        updatedBy: { type: String, default: 'System' },
      },
    ],
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' },
        changedBy: { type: String, default: 'System' },
        updatedBy: { type: String, default: 'System' },
      },
    ],
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted Naira amount
OrderSchema.virtual('totalNaira').get(function () {
  return Math.round(this.totalKobo / 100);
});

// Pre-validate hook to ensure orderId / orderNumber synchronization
OrderSchema.pre<IOrder>('validate', function (next) {
  if (!this.orderId && this.orderNumber) {
    this.orderId = this.orderNumber;
  }
  if (!this.orderNumber && this.orderId) {
    this.orderNumber = this.orderId;
  }
  if (!this.customerId && this.customer) {
    this.customerId = this.customer;
  }
  if (!this.customer && this.customerId) {
    this.customer = this.customerId;
  }
  if (!this.deliveryAddress && this.shippingAddress) {
    this.deliveryAddress = typeof this.shippingAddress === 'string'
      ? this.shippingAddress
      : `${this.shippingAddress.street || ''}, ${this.shippingAddress.city || ''}`;
  }
  next();
});

// Pre-save hook to ensure orderId / orderNumber synchronization
OrderSchema.pre<IOrder>('save', function (next) {
  if (!this.orderId && this.orderNumber) {
    this.orderId = this.orderNumber;
  }
  if (!this.orderNumber && this.orderId) {
    this.orderNumber = this.orderId;
  }
  if (!this.customerId && this.customer) {
    this.customerId = this.customer;
  }
  if (!this.customer && this.customerId) {
    this.customer = this.customerId;
  }
  if (this.timeline && this.timeline.length > 0 && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = this.timeline;
  }
  if (this.statusHistory && this.statusHistory.length > 0 && (!this.timeline || this.timeline.length === 0)) {
    this.timeline = this.statusHistory;
  }
  next();
});

export const Order = model<IOrder>('Order', OrderSchema);
