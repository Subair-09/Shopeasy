import { AuditLog } from '../models/AuditLog';

interface AuditLogParams {
  adminId?: string;
  adminEmail: string;
  action: string;
  description: string;
  recordType?: string;
  recordId?: string;
  targetResource?: string;
  targetId?: string;
  metadata?: any;
}

export const recordAuditLog = async (params: AuditLogParams): Promise<void> => {
  try {
    await AuditLog.create({
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      action: params.action,
      description: params.description,
      recordType: params.targetResource || params.recordType,
      recordId: params.targetId || params.recordId,
      metadata: params.metadata,
    });
  } catch (error) {
    console.error('[AuditLog Error]', error);
  }
};
