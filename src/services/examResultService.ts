import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IExamResult, IExamResultCreate, IExamResultUpdate } from '@/types/examResult';

import { api } from '@/lib/axios';

export const examResultService = {
  getExamResults: async (params = {}): Promise<IBasePaginatedResponse<IExamResult>> => {
    const response = await api.get<IBasePaginatedResponse<IExamResult>>('/exam-results', {
      params,
    });
    return response.data;
  },

  getExamResult: async (id: number): Promise<IBaseResponse<IExamResult>> => {
    const response = await api.get<IBaseResponse<IExamResult>>(`/exam-results/${id}`);
    return response.data;
  },

  createExamResult: async (data: IExamResultCreate): Promise<IExamResult> => {
    const response = await api.post<IExamResult>('/exam-results', data);
    return response.data;
  },

  createExamResultBulk: async (data: IExamResultCreate[]): Promise<IExamResult> => {
    const response = await api.post<IExamResult>('/exam-results/bulk', data);
    return response.data;
  },

  updateExamResult: async (id: number, data: IExamResultUpdate): Promise<IExamResult> => {
    const response = await api.patch<IExamResult>(`/exam-results/${id}`, data);
    return response.data;
  },

  deleteExamResult: async (id: number): Promise<void> => {
    const response = await api.delete(`/exam-results/${id}`);
    return response.data;
  },
};
