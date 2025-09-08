import { IAddress, IAddressCreate, IAddressUpdate } from '@/types/address';
import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';

import { api } from '@/lib/axios';

export const addressService = {
  getAddresses: async (params = {}): Promise<IBasePaginatedResponse<IAddress>> => {
    const response = await api.get<IBasePaginatedResponse<IAddress>>('/addresses', { params });
    return response.data;
  },

  getAddress: async (id: number): Promise<IBaseResponse<IAddress>> => {
    const response = await api.get<IBaseResponse<IAddress>>(`/addresses/${id}`);
    return response.data;
  },

  createAddress: async (data: IAddressCreate): Promise<IAddress> => {
    const response = await api.post<IAddress>('/addresses', data);
    return response.data;
  },

  updateAddress: async (id: number, data: IAddressUpdate): Promise<IAddress> => {
    const response = await api.patch<IAddress>(`/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: number): Promise<void> => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },
};
