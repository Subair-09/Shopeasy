import { Schema, model, Document } from 'mongoose';

export interface IInventoryTransaction extends Document {
  productId: Schema.Types.ObjectId | string;
  productName: string;
  sku: string;
  previousStock: number;
  newStock: number;
  quantityChanged: number;
  reason: 'Order Purchase' | 'Stock In' | 'Damaged' | 'Return' | 'Manual Adjustment';
  adminId?: Schema.Types.ObjectId | string;
  referenceOrder?: string;
}

const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    quantityChanged: { type: Number, required: true },
    reason: {
      type: String,
      enum: ['Order Purchase', 'Stock In', 'Damaged', 'Return', 'Manual Adjustment'],
      default: 'Manual Adjustment',
    },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
    referenceOrder: { type: String },
  },
  { timestamps: true }
);

export const InventoryTransaction = model<IInventoryTransaction>(
  'InventoryTransaction',
  InventoryTransactionSchema
);
