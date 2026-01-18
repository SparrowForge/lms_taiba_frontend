import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { INotification, INotificationCreate, IResponseNotificationCount } from '@/types/notification';

import { api } from '@/lib/axios';

export const notificationService = {
  getNotifications: async (params = {}): Promise<IBasePaginatedResponse<INotification>> => {
    const response = await api.get<IBasePaginatedResponse<INotification>>('/notifications', {
      params,
    });
    return response.data;
  },

  getNotification: async (id: number): Promise<INotification> => {
    const response = await api.get<IBaseResponse<INotification>>(`/notifications/${id}`);
    return response.data.data;
  },

  createNotification: async (data: INotificationCreate): Promise<INotification> => {
    const response = await api.post<IBaseResponse<INotification>>('/notifications', data);
    return response.data.data;
  },

  markNotificationAsRead: async (id: number): Promise<INotification> => {
    const response = await api.patch<IBaseResponse<INotification>>(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllNotificationsAsRead: async (): Promise<IResponseNotificationCount> => {
    const response = await api.patch<IBaseResponse<IResponseNotificationCount>>('/notifications/mark-all-read');
    return response.data.data;
  },

  getUnreadCount: async (): Promise<IResponseNotificationCount> => {
    const response = await api.get<IBaseResponse<IResponseNotificationCount>>('/notifications/unread-count');
    return response.data.data;
  },

  deleteNotification: async (id: number): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};
