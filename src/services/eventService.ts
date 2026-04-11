import { api } from '@/lib/axios';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IEvent, IEventCreate, IEventUpdate } from '@/types/event';

export const eventService = {
  getEvents: async (params = {}): Promise<IBasePaginatedResponse<IEvent>> => {
    const response = await api.get<IBasePaginatedResponse<IEvent>>('/events', { params });
    return response.data;
  },

  getEvent: async (id: number): Promise<IBaseResponse<IEvent>> => {
    const response = await api.get<IBaseResponse<IEvent>>(`/events/${id}`);
    return response.data;
  },

  createEvent: async (data: IEventCreate): Promise<IEvent> => {
    const response = await api.post<IEvent>('/events', data);
    return response.data;
  },

  updateEvent: async (id: number, data: IEventUpdate): Promise<IEvent> => {
    const response = await api.patch<IEvent>(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

