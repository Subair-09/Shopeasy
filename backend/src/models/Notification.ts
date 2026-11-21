import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
  recipientType: 'admin' | 'customer';
  recipientId?: Schema.Types.ObjectId | string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system' | 'payment' | 'inventory';
  isRead: boolean;
  metadata?: any;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientType: { type: String, enum: ['admin', 'customer'], required: true },
    recipientId: { type: Schema.Types.ObjectId, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['order', 'promo', 'system', 'payment', 'inventory'],
      default: 'system',
    },
    isRead: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Notification = model<INotification>('Notification', NotificationSchema);
