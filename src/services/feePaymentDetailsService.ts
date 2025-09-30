import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IFeePaymentDetails,
  IFeePaymentDetailsCreate,
  IFeePaymentDetailsUpdate,
} from '@/types/feePaymentDetails';

import { api } from '@/lib/axios';

export const feePaymentDetailsService = {
  getFeePaymentDetails: async (
    params = {},
  ): Promise<IBasePaginatedResponse<IFeePaymentDetails>> => {
    const response = await api.get<IBasePaginatedResponse<IFeePaymentDetails>>(
      '/fee-payment-details',
      {
        params,
      },
    );
    return response.data;
  },

  getFeePaymentDetail: async (id: number): Promise<IBaseResponse<IFeePaymentDetails>> => {
    const response = await api.get<IBaseResponse<IFeePaymentDetails>>(`/fee-payment-details/${id}`);
    return response.data;
  },

  createFeePaymentDetail: async (data: IFeePaymentDetailsCreate): Promise<IFeePaymentDetails> => {
    const response = await api.post<IFeePaymentDetails>('/fee-payment-details', data);
    return response.data;
  },

  updateFeePaymentDetail: async (
    id: number,
    data: IFeePaymentDetailsUpdate,
  ): Promise<IFeePaymentDetails> => {
    const response = await api.patch<IFeePaymentDetails>(`/fee-payment-details/${id}`, data);
    return response.data;
  },

  deleteFeePaymentDetail: async (id: number): Promise<void> => {
    const response = await api.delete(`/fee-payment-details/${id}`);
    return response.data;
  },
};
