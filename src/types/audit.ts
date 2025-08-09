export interface IAudit {
  id: number;
  userId: number;
  username: string;
  action: string;
  resource: string;
  resourceId: number | null;
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  requestBody: string | null;
  responseStatus: number;
  responseTime: number;
  success: boolean;
  error: string | null;
  timestamp: string;
  updatedAt: string;
  deletedAt: string | null;
}
