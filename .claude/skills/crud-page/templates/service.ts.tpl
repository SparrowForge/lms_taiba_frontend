import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  I__PascalSingular__,
  I__PascalSingular__Create,
  I__PascalSingular__Update,
} from '@/types/__camelSingular__';

import { api } from '@/lib/axios';

export const __camelSingular__Service = {
  get__PascalPlural__: async (
    params = {},
  ): Promise<IBasePaginatedResponse<I__PascalSingular__>> => {
    const response = await api.get<IBasePaginatedResponse<I__PascalSingular__>>(
      '/__kebabPlural__',
      {
        params,
      },
    );
    return response.data;
  },

  get__PascalSingular__: async (id: number): Promise<IBaseResponse<I__PascalSingular__>> => {
    const response = await api.get<IBaseResponse<I__PascalSingular__>>(`/__kebabPlural__/${id}`);
    return response.data;
  },

  create__PascalSingular__: async (
    data: I__PascalSingular__Create,
  ): Promise<I__PascalSingular__> => {
    const response = await api.post<I__PascalSingular__>('/__kebabPlural__', data);
    return response.data;
  },

  update__PascalSingular__: async (
    id: number,
    data: I__PascalSingular__Update,
  ): Promise<I__PascalSingular__> => {
    const response = await api.patch<I__PascalSingular__>(`/__kebabPlural__/${id}`, data);
    return response.data;
  },

  delete__PascalSingular__: async (id: number): Promise<void> => {
    const response = await api.delete(`/__kebabPlural__/${id}`);
    return response.data;
  },
};
