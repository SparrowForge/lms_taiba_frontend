import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IFeeStructure, IFeeStructureCreate, IFeeStructureUpdate} from '@/types/feeStructure';

import {api} from '@/lib/axios';

export const feeStructureService = {
  getFeeStructures: async (params = {}): Promise<IBasePaginatedResponse<IFeeStructure>> => {
    const response = await api.get<IBasePaginatedResponse<IFeeStructure>>('/fee-structures', { params });
    return response.data;
  },

  getFeeStructure: async (id: number): Promise<IBaseResponse<IFeeStructure>> => {
    const response = await api.get<IBaseResponse<IFeeStructure>>(`/fee-structures/${id}`);
    return response.data;
  },

  createFeeStructure: async (data: IFeeStructureCreate): Promise<IFeeStructure> => {
    const response = await api.post<IFeeStructure>('/fee-structures', data);
    return response.data;
  },

  updateFeeStructure: async (id: number, data: IFeeStructureUpdate): Promise<IFeeStructure> => {
    const response = await api.patch<IFeeStructure>(`/fee-structures/${id}`, data);
    return response.data;
  },

  deleteFeeStructure: async (id: number): Promise<void> => {
    const response = await api.delete(`/fee-structures/${id}`);
    return response.data;
  },
};
