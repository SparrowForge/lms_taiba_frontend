import { api } from '@/lib/axios';
import { IVoucherType, IVoucherTypeCreate, IVoucherTypeUpdate } from '@/types/voucherType';

export const voucherTypeService = {
  getAll: async (): Promise<IVoucherType[]> => {
    const response = await api.get<IVoucherType[]>('/voucher-types');
    return response.data;
  },

  getById: async (id: number): Promise<IVoucherType> => {
    const response = await api.get<IVoucherType>(`/voucher-types/${id}`);
    return response.data;
  },

  create: async (data: IVoucherTypeCreate): Promise<IVoucherType> => {
    const response = await api.post<IVoucherType>('/voucher-types', data);
    return response.data;
  },

  update: async (id: number, data: IVoucherTypeUpdate): Promise<IVoucherType> => {
    const response = await api.patch<IVoucherType>(`/voucher-types/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/voucher-types/${id}`);
  },
};
