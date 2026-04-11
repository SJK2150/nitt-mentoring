import { Client } from "./database.js";

const client = new Client();

export interface AuditLogEntry {
  userId: number;
  action: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(entry: AuditLogEntry) {
  try {
    // Audit logs table removed - just log to console
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: entry.userId,
      action: entry.action,
      details: entry.details,
      ipAddress: entry.ipAddress || 'unknown',
      userAgent: entry.userAgent || 'unknown',
    };
    console.log('[AUDIT]', JSON.stringify(logEntry));
  } catch (error) {
    console.error('Audit logging error:', error);
    // Don't throw - audit failures shouldn't break the app
  }
}

export function getAuditContext(event: any) {
  return {
    ipAddress: getRequestIP(event, { xForwardedFor: true }),
    userAgent: getHeader(event, 'user-agent'),
  };
}
