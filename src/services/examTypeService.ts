import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IExamType, IExamTypeCreate, IExamTypeUpdate } from '@/types/examType';

import { api } from '@/lib/axios';

export const examTypeService = {
  getExamTypes: async (params = {}): Promise<IBasePaginatedResponse<IExamType>> => {
    const response = await api.get<IBasePaginatedResponse<IExamType>>('/exam-types', { params });
    return response.data;
  },

  getExamType: async (id: number): Promise<IBaseResponse<IExamType>> => {
    const response = await api.get<IBaseResponse<IExamType>>(`/exam-types/${id}`);
    return response.data;
  },

  createExamType: async (data: IExamTypeCreate): Promise<IExamType> => {
    const response = await api.post<IExamType>('/exam-types', data);
    return response.data;
  },

  updateExamType: async (id: number, data: IExamTypeUpdate): Promise<IExamType> => {
    const response = await api.patch<IExamType>(`/exam-types/${id}`, data);
    return response.data;
  },

  deleteExamType: async (id: number): Promise<void> => {
    const response = await api.delete(`/exam-types/${id}`);
    return response.data;
  },
};
