import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IMarkDistribution,
  IMarkDistributionCreate,
  IMarkDistributionUpdate,
} from '@/types/markDistribution';

import { api } from '@/lib/axios';

export const markDistributionService = {
  getMarkDistributions: async (params = {}): Promise<IBasePaginatedResponse<IMarkDistribution>> => {
    const response = await api.get<IBasePaginatedResponse<IMarkDistribution>>(
      '/mark-distributions',
      { params },
    );
    return response.data;
  },

  getMarkDistribution: async (id: number): Promise<IBaseResponse<IMarkDistribution>> => {
    const response = await api.get<IBaseResponse<IMarkDistribution>>(`/mark-distributions/${id}`);
    return response.data;
  },

  createMarkDistribution: async (data: IMarkDistributionCreate): Promise<IMarkDistribution> => {
    const response = await api.post<IMarkDistribution>('/mark-distributions', data);
    return response.data;
  },

  updateMarkDistribution: async (
    id: number,
    data: IMarkDistributionUpdate,
  ): Promise<IMarkDistribution> => {
    const response = await api.patch<IMarkDistribution>(`/mark-distributions/${id}`, data);
    return response.data;
  },

  deleteMarkDistribution: async (id: number): Promise<void> => {
    const response = await api.delete(`/mark-distributions/${id}`);
    return response.data;
  },
};
