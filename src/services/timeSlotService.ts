import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { ITimeSlot, ITimeSlotCreate, ITimeSlotUpdate } from '@/types/timeSlot';

import { api } from '@/lib/axios';

export const timeSlotService = {
  getTimeSlots: async (params = {}): Promise<IBasePaginatedResponse<ITimeSlot>> => {
    const response = await api.get<IBasePaginatedResponse<ITimeSlot>>('/time-slots', { params });
    return response.data;
  },

  getTimeSlot: async (id: number): Promise<IBaseResponse<ITimeSlot>> => {
    const response = await api.get<IBaseResponse<ITimeSlot>>(`/time-slots/${id}`);
    return response.data;
  },

  createTimeSlot: async (data: ITimeSlotCreate): Promise<ITimeSlot> => {
    const response = await api.post<ITimeSlot>('/time-slots', data);
    return response.data;
  },

  updateTimeSlot: async (id: number, data: ITimeSlotUpdate): Promise<ITimeSlot> => {
    const response = await api.put<ITimeSlot>(`/time-slots/${id}`, data);
    return response.data;
  },

  deleteTimeSlot: async (id: number): Promise<void> => {
    await api.delete(`/time-slots/${id}`);
  },
};
