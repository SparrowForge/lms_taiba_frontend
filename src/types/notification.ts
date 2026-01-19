import { IUser } from './user';

export interface INotification {
  id: number;
  userId: number;
  type: string;
  category: string;
  priority: string;
  title: string;
  message: string;
  data: Record<string, any>;
  resourceType: string;
  resourceId: number;
  status: string;
  errorMessage: string | null;
  readAt: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  user: IUser;
}

export interface INotificationCreate {
  userId: number;
  type: string;
  category: string;
  priority: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  resourceType?: string;
  resourceId?: number;
  status?: string;
  expiresAt?: string;
}

export interface IResponseNotificationCount {
  count: number;
}
