import { api } from '@/lib/axios';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IEventType, IEventTypeCreate, IEventTypeUpdate } from '@/types/eventType';

export const eventTypeService = {
  getEventTypes: async (params = {}): Promise<IBasePaginatedResponse<IEventType>> => {
    const response = await api.get<IBasePaginatedResponse<IEventType>>('/event-types', { params });
    return response.data;
  },

  getEventType: async (id: number): Promise<IBaseResponse<IEventType>> => {
    const response = await api.get<IBaseResponse<IEventType>>(`/event-types/${id}`);
    return response.data;
  },

  createEventType: async (data: IEventTypeCreate): Promise<IEventType> => {
    const response = await api.post<IEventType>('/event-types', data);
    return response.data;
  },

  updateEventType: async (id: number, data: IEventTypeUpdate): Promise<IEventType> => {
    const response = await api.patch<IEventType>(`/event-types/${id}`, data);
    return response.data;
  },

  deleteEventType: async (id: number): Promise<void> => {
    const response = await api.delete(`/event-types/${id}`);
    return response.data;
  },
};

