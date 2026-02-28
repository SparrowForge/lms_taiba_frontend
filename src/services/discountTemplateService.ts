import { api } from '@/lib/axios';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IDiscountTemplate,
  IDiscountTemplateCreate,
  IDiscountTemplateUpdate,
} from '@/types/discountTemplate';

export const discountTemplateService = {
  getDiscountTemplates: async (
    params = {},
  ): Promise<IBasePaginatedResponse<IDiscountTemplate>> => {
    const response = await api.get<IBasePaginatedResponse<IDiscountTemplate>>(
      '/discount-templates',
      {
        params,
      },
    );
    return response.data;
  },

  getDiscountTemplate: async (id: number): Promise<IBaseResponse<IDiscountTemplate>> => {
    const response = await api.get<IBaseResponse<IDiscountTemplate>>(`/discount-templates/${id}`);
    return response.data;
  },

  createDiscountTemplate: async (
    data: IDiscountTemplateCreate,
  ): Promise<IDiscountTemplate> => {
    const response = await api.post<IDiscountTemplate>('/discount-templates', data);
    return response.data;
  },

  updateDiscountTemplate: async (
    id: number,
    data: IDiscountTemplateUpdate,
  ): Promise<IDiscountTemplate> => {
    const response = await api.patch<IDiscountTemplate>(`/discount-templates/${id}`, data);
    return response.data;
  },

  deleteDiscountTemplate: async (id: number): Promise<void> => {
    const response = await api.delete(`/discount-templates/${id}`);
    return response.data;
  },
};

