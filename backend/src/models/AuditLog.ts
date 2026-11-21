import { Schema, model, Document } from 'mongoose';

export interface IAuditLog extends Document {
  adminId?: Schema.Types.ObjectId | string;
  adminEmail: string;
  action: string;
  description: string;
  recordType?: string;
  recordId?: string;
  metadata?: any;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    description: { type: String, required: true },
    recordType: { type: String },
    recordId: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const AuditLog = model<IAuditLog>('AuditLog', AuditLogSchema);
