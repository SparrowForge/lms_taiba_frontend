import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IFeeInstallmentPlan, IFeeInstallmentPlanCreate, IFeeInstallmentPlanUpdate,} from '@/types/feeInstallmentPlan';

import {api} from '@/lib/axios';

export const feeInstallmentPlanService = {
  // Get all fee installment plans with pagination and search
  getFeeInstallmentPlans: async (
    params = {},
  ): Promise<IBasePaginatedResponse<IFeeInstallmentPlan>> => {
    const response = await api.get<IBasePaginatedResponse<IFeeInstallmentPlan>>(
      '/fee-installment-plans',
      { params },
    );
    return response.data;
  },

  // Get a single fee installment plan by id
  getFeeInstallmentPlan: async (id: number): Promise<IBaseResponse<IFeeInstallmentPlan>> => {
    const response = await api.get<IBaseResponse<IFeeInstallmentPlan>>(
      `/fee-installment-plans/${id}`,
    );
    return response.data;
  },

  // Create a new fee installment plan
  createFeeInstallmentPlan: async (
    data: IFeeInstallmentPlanCreate,
  ): Promise<IFeeInstallmentPlan> => {
    const response = await api.post<IFeeInstallmentPlan>('/fee-installment-plans', data);
    return response.data;
  },

  // Update an existing fee installment plan
  updateFeeInstallmentPlan: async (
    id: number,
    data: IFeeInstallmentPlanUpdate,
  ): Promise<IFeeInstallmentPlan> => {
    const response = await api.patch<IFeeInstallmentPlan>(
      `/fee-installment-plans/${id}`,
      data,
    );
    return response.data;
  },

  // Delete a fee installment plan
  deleteFeeInstallmentPlan: async (id: number): Promise<void> => {
    const response = await api.delete(`/fee-installment-plans/${id}`);
    return response.data;
  },
};
