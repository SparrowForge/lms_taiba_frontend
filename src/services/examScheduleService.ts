import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IExamSchedule, IExamScheduleCreate, IExamScheduleUpdate } from '@/types/examSchedule';

import { api } from '@/lib/axios';

export const examScheduleService = {
  getExamSchedules: async (params = {}): Promise<IBasePaginatedResponse<IExamSchedule>> => {
    const response = await api.get('/exam-schedules', { params });
    return response.data;
  },

  getExamSchedule: async (id: number): Promise<IBaseResponse<IExamSchedule>> => {
    const response = await api.get(`/exam-schedules/${id}`);
    return response.data;
  },

  createExamSchedule: async (data: IExamScheduleCreate): Promise<IBaseResponse<IExamSchedule>> => {
    const response = await api.post('/exam-schedules', data);
    return response.data;
  },

  updateExamSchedule: async (
    id: number,
    data: IExamScheduleUpdate,
  ): Promise<IBaseResponse<IExamSchedule>> => {
    const response = await api.put(`/exam-schedules/${id}`, data);
    return response.data;
  },

  deleteExamSchedule: async (id: number): Promise<IBaseResponse<void>> => {
    const response = await api.delete(`/exam-schedules/${id}`);
    return response.data;
  },
};
