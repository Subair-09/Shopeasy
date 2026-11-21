import { Schema, model, Document } from 'mongoose';

export interface IPayment extends Document {
  orderId: Schema.Types.ObjectId | string;
  orderNumber: string;
  customerId?: Schema.Types.ObjectId | string;
  reference: string;
  amountKobo: number;
  currency: string;
  channel: string;
  status: 'Pending' | 'Success' | 'Failed' | 'Refunded';
  gatewayResponse?: any;
  paidAt?: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    orderNumber: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    reference: { type: String, required: true, unique: true, index: true },
    amountKobo: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    channel: { type: String, default: 'card' },
    status: {
      type: String,
      enum: ['Pending', 'Success', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    gatewayResponse: { type: Schema.Types.Mixed },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>('Payment', PaymentSchema);
