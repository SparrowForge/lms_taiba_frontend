import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IGradeRule, IGradeRuleCreate, IGradeRuleUpdate } from '@/types/gradeRule';

import { api } from '@/lib/axios';

export const gradeRuleService = {
  getGradeRules: async (params = {}): Promise<IBasePaginatedResponse<IGradeRule>> => {
    const response = await api.get<IBasePaginatedResponse<IGradeRule>>('/grade-rules', { params });
    return response.data;
  },

  getGradeRule: async (id: number): Promise<IBaseResponse<IGradeRule>> => {
    const response = await api.get<IBaseResponse<IGradeRule>>(`/grade-rules/${id}`);
    return response.data;
  },

  createGradeRule: async (data: IGradeRuleCreate): Promise<IGradeRule> => {
    const response = await api.post<IGradeRule>('/grade-rules', data);
    return response.data;
  },

  updateGradeRule: async (id: number, data: IGradeRuleUpdate): Promise<IGradeRule> => {
    const response = await api.patch<IGradeRule>(`/grade-rules/${id}`, data);
    return response.data;
  },

  deleteGradeRule: async (id: number): Promise<void> => {
    const response = await api.delete(`/grade-rules/${id}`);
    return response.data;
  },
};
