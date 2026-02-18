import { api } from '@/lib/axios';
import { IFinancialYear, IFinancialYearCreate, IFinancialYearUpdate } from '@/types/financialYear';

export const financialYearService = {
  getAll: async (): Promise<IFinancialYear[]> => {
    const response = await api.get<IFinancialYear[]>('/financial-years');
    return response.data;
  },

  getById: async (id: number): Promise<IFinancialYear> => {
    const response = await api.get<IFinancialYear>(`/financial-years/${id}`);
    return response.data;
  },

  create: async (data: IFinancialYearCreate): Promise<IFinancialYear> => {
    const response = await api.post<IFinancialYear>('/financial-years', data);
    return response.data;
  },

  update: async (id: number, data: IFinancialYearUpdate): Promise<IFinancialYear> => {
    const response = await api.patch<IFinancialYear>(`/financial-years/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/financial-years/${id}`);
  },
};
