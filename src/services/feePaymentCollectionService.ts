import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IFeePaymentCollection,
  IFeePaymentCollectionBulk,
  IFeePaymentCollectionCreate,
  IFeePaymentCollectionUpdate,
} from '@/types/feePaymentCollection';

import { api } from '@/lib/axios';

export const feePaymentCollectionService = {
  getFeePaymentCollections: async (
    params = {},
  ): Promise<IBasePaginatedResponse<IFeePaymentCollection>> => {
    const response = await api.get<IBasePaginatedResponse<IFeePaymentCollection>>(
      '/fee-payment-collections',
      {
        params,
      },
    );
    return response.data;
  },

  getFeePaymentCollection: async (id: number): Promise<IBaseResponse<IFeePaymentCollection>> => {
    const response = await api.get<IBaseResponse<IFeePaymentCollection>>(
      `/fee-payment-collections/${id}`,
    );
    return response.data;
  },

  createFeePaymentCollection: async (
    data: IFeePaymentCollectionCreate,
  ): Promise<IFeePaymentCollection> => {
    const response = await api.post<IFeePaymentCollection>('/fee-payment-collections', data);
    return response.data;
  },

  createFeePaymentCollectionBulk: async (
    data: IFeePaymentCollectionBulk,
  ): Promise<IFeePaymentCollection> => {
    const response = await api.post<IFeePaymentCollection>('/fee-payment-collections/bulk', data);
    return response.data;
  },

  updateFeePaymentCollection: async (
    id: number,
    data: IFeePaymentCollectionUpdate,
  ): Promise<IFeePaymentCollection> => {
    const response = await api.patch<IFeePaymentCollection>(`/fee-payment-collections/${id}`, data);
    return response.data;
  },

  deleteFeePaymentCollection: async (id: number): Promise<void> => {
    const response = await api.delete(`/fee-payment-collections/${id}`);
    return response.data;
  },
};
