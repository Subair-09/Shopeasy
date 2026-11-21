import { Schema, model, Document } from 'mongoose';

export interface ISupportTicket extends Document {
  ticketNumber: string;
  customerId?: Schema.Types.ObjectId | string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  responses: Array<{
    sender: 'customer' | 'admin';
    senderName: string;
    message: string;
    timestamp: Date;
  }>;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    responses: [
      {
        sender: { type: String, enum: ['customer', 'admin'], required: true },
        senderName: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const SupportTicket = model<ISupportTicket>('SupportTicket', SupportTicketSchema);
