import { api } from '@/lib/axios';
import { IBasePaginatedResponse } from '@/types/common';
import { IFinancialYear, IFinancialYearCreate, IFinancialYearUpdate } from '@/types/financialYear';

export const financialYearService = {
  getAll: async (): Promise<IBasePaginatedResponse<IFinancialYear>> => {
    const response = await api.get<IBasePaginatedResponse<IFinancialYear>>('/financial-years');
    return response.data;
  },

  getById: async (id: number): Promise<IFinancialYear> => {
    const response = await api.get<IFinancialYear>(`/financial-years/${id}`);
    // @ts-ignore
    return response.data.data;
  },

  create: async (data: IFinancialYearCreate): Promise<IFinancialYear> => {
    const response = await api.post<IFinancialYear>('/financial-years', data);
    // @ts-ignore
    return response.data.data;
  },

  update: async (id: number, data: IFinancialYearUpdate): Promise<IFinancialYear> => {
    const response = await api.patch<IFinancialYear>(`/financial-years/${id}`, data);
    // @ts-ignore
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/financial-years/${id}`);
  },
};
