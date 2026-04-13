export interface AuditLogEntry {
  userId: number;
  action: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(entry: AuditLogEntry) {
  // Intentionally no-op: audit persistence is currently disabled.
  void entry;
}

export function getAuditContext(event: any) {
  return {
    ipAddress: getRequestIP(event, { xForwardedFor: true }),
    userAgent: getHeader(event, 'user-agent'),
  };
}
