import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  ISubjectExamResult,
  IPublishSubjectResultRequest,
  IPublishSubjectResultResponse,
} from '@/types/subjectResult';

import { api } from '@/lib/axios';

export const subjectResultService = {
  getSubjectResults: async (
    params = {},
  ): Promise<IBasePaginatedResponse<ISubjectExamResult>> => {
    const response = await api.get<IBasePaginatedResponse<ISubjectExamResult>>(
      '/subject-results',
      { params },
    );
    return response.data;
  },

  getSubjectResult: async (id: number): Promise<IBaseResponse<ISubjectExamResult>> => {
    const response = await api.get<IBaseResponse<ISubjectExamResult>>(
      `/subject-results/${id}`,
    );
    return response.data;
  },

  publishSubjectResults: async (
    data: IPublishSubjectResultRequest,
  ): Promise<IPublishSubjectResultResponse> => {
    const response = await api.post<IPublishSubjectResultResponse>(
      '/subject-results/publish',
      data,
    );
    return response.data;
  },
};
