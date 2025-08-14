import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IEmploymentType, IEmploymentTypeCreate, IEmploymentTypeUpdate,} from '@/types/employmentType';

import {api} from '@/lib/axios';

export const employmentTypeService = {
  getEmploymentTypes: async (params = {}): Promise<IBasePaginatedResponse<IEmploymentType>> => {
    const response = await api.get<IBasePaginatedResponse<IEmploymentType>>('/employment-types', {
      params,
    });
    return response.data;
  },

  getEmploymentType: async (id: number): Promise<IBaseResponse<IEmploymentType>> => {
    const response = await api.get<IBaseResponse<IEmploymentType>>(`/employment-types/${id}`);
    return response.data;
  },

  createEmploymentType: async (data: IEmploymentTypeCreate): Promise<IEmploymentType> => {
    const response = await api.post<IEmploymentType>('/employment-types', data);
    return response.data;
  },

  updateEmploymentType: async (
    id: number,
    data: IEmploymentTypeUpdate,
  ): Promise<IEmploymentType> => {
    const response = await api.patch<IEmploymentType>(`/employment-types/${id}`, data);
    return response.data;
  },

  deleteEmploymentType: async (id: number): Promise<void> => {
    const response = await api.delete(`/employment-types/${id}`);
    return response.data;
  },
};
