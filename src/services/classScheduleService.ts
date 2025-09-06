import {IClassSchedule, IClassScheduleCreate, IClassScheduleUpdate} from '@/types/classSchedule';
import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';

import {api} from '@/lib/axios';

export const classScheduleService = {
  getClassSchedules: async (params = {}): Promise<IBasePaginatedResponse<IClassSchedule>> => {
    const response = await api.get<IBasePaginatedResponse<IClassSchedule>>('/class-schedules', {
      params,
    });
    return response.data;
  },

  getClassSchedule: async (id: number): Promise<IBaseResponse<IClassSchedule>> => {
    const response = await api.get<IBaseResponse<IClassSchedule>>(`/class-schedules/${id}`);
    return response.data;
  },

  createClassSchedule: async (data: IClassScheduleCreate): Promise<IClassSchedule> => {
    const response = await api.post<IClassSchedule>('/class-schedules', data);
    return response.data;
  },

  updateClassSchedule: async (id: number, data: IClassScheduleUpdate): Promise<IClassSchedule> => {
    const response = await api.put<IClassSchedule>(`/class-schedules/${id}`, data);
    return response.data;
  },

  deleteClassSchedule: async (id: number): Promise<void> => {
    await api.delete(`/class-schedules/${id}`);
  },
};
