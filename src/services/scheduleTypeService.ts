import {IBasePaginatedResponse} from '@/types/common';
import {IScheduleType, IScheduleTypeCreate, IScheduleTypeUpdate} from '@/types/scheduleType';

import {api} from '@/lib/axios';

export const scheduleTypeService = {
  getScheduleTypes: async (params = {}): Promise<IBasePaginatedResponse<IScheduleType>> => {
    const response = await api.get<IBasePaginatedResponse<IScheduleType>>('/schedule-types', {
      params,
    });
    return response.data;
  },

  getScheduleType: async (id: number): Promise<IScheduleType> => {
    const response = await api.get<IScheduleType>(`/schedule-types/${id}`);
    return response.data;
  },

  createScheduleType: async (data: IScheduleTypeCreate): Promise<IScheduleType> => {
    const response = await api.post<IScheduleType>('/schedule-types', data);
    return response.data;
  },

  updateScheduleType: async (id: number, data: IScheduleTypeUpdate): Promise<IScheduleType> => {
    const response = await api.patch<IScheduleType>(`/schedule-types/${id}`, data);
    return response.data;
  },

  deleteScheduleType: async (id: number): Promise<void> => {
    const response = await api.delete(`/schedule-types/${id}`);
    return response.data;
  },
};
