import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IInstitute, IInstituteCreate, IInstituteUpdate } from '@/types/institute';

import { api } from '@/lib/axios';

export const instituteService = {
  getInstitutes: async (params = {}): Promise<IBasePaginatedResponse<IInstitute>> => {
    const response = await api.get<IBasePaginatedResponse<IInstitute>>('/institutes', { params });
    return response.data;
  },

  getInstitute: async (id: number): Promise<IBaseResponse<IInstitute>> => {
    const response = await api.get<IBaseResponse<IInstitute>>(`/institutes/${id}`);
    return response.data;
  },

  createInstitute: async (data: IInstituteCreate): Promise<IInstitute> => {
    const response = await api.post<IInstitute>('/institutes', data);
    return response.data;
  },

  updateInstitute: async (id: number, data: IInstituteUpdate): Promise<IInstitute> => {
    const response = await api.patch<IInstitute>(`/institutes/${id}`, data);
    return response.data;
  },

  deleteInstitute: async (id: number): Promise<void> => {
    const response = await api.delete(`/institutes/${id}`);
    return response.data;
  },
};
