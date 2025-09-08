import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IWeekDay, IWeekDayCreate, IWeekDayUpdate } from '@/types/weekDay';

import { api } from '@/lib/axios';

export const weekDayService = {
  getWeekDays: async (params = {}): Promise<IBasePaginatedResponse<IWeekDay>> => {
    const response = await api.get<IBasePaginatedResponse<IWeekDay>>('/week-days', { params });
    return response.data;
  },

  getWeekDay: async (id: number): Promise<IBaseResponse<IWeekDay>> => {
    const response = await api.get<IBaseResponse<IWeekDay>>(`/week-days/${id}`);
    return response.data;
  },

  createWeekDay: async (data: IWeekDayCreate): Promise<IWeekDay> => {
    const response = await api.post<IWeekDay>('/week-days', data);
    return response.data;
  },

  updateWeekDay: async (id: number, data: IWeekDayUpdate): Promise<IWeekDay> => {
    const response = await api.put<IWeekDay>(`/week-days/${id}`, data);
    return response.data;
  },

  deleteWeekDay: async (id: number): Promise<void> => {
    await api.delete(`/week-days/${id}`);
  },
};
