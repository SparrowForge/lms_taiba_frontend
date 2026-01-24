import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IExamSubmission,
  IExamSubmissionCreate,
  IExamSubmissionUpdate,
} from '@/types/examSubmission';

import { api } from '@/lib/axios';

export const examSubmissionService = {
  getExamSubmissions: async (params = {}): Promise<IBasePaginatedResponse<IExamSubmission>> => {
    const response = await api.get<IBasePaginatedResponse<IExamSubmission>>('/exam-submissions', {
      params,
    });
    return response.data;
  },

  getExamSubmission: async (id: number): Promise<IExamSubmission> => {
    const response = await api.get<IBaseResponse<IExamSubmission>>(`/exam-submissions/${id}`);
    return response.data.data;
  },

  createExamSubmission: async (data: IExamSubmissionCreate): Promise<IExamSubmission> => {
    const response = await api.post<IBaseResponse<IExamSubmission>>('/exam-submissions', data);
    return response.data.data;
  },

  updateExamSubmission: async (
    id: number,
    data: IExamSubmissionUpdate,
  ): Promise<IExamSubmission> => {
    const response = await api.patch<IBaseResponse<IExamSubmission>>(`/exam-submissions/${id}`, data);
    return response.data.data;
  },

  deleteExamSubmission: async (id: number): Promise<void> => {
    await api.delete(`/exam-submissions/${id}`);
  },
};
