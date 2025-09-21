import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  ICreateExamCandidateBulk,
  IExamCandidate,
  IExamCandidateCreate,
  IExamCandidateUpdate,
} from '@/types/examCandidate';

import { api } from '@/lib/axios';

export const examCandidateService = {
  getExamCandidates: async (params = {}): Promise<IBasePaginatedResponse<IExamCandidate>> => {
    const response = await api.get<IBasePaginatedResponse<IExamCandidate>>('/exam-candidates', {
      params,
    });
    return response.data;
  },

  getExamCandidate: async (id: number): Promise<IBaseResponse<IExamCandidate>> => {
    const response = await api.get<IBaseResponse<IExamCandidate>>(`/exam-candidates/${id}`);
    return response.data;
  },

  createExamCandidate: async (data: IExamCandidateCreate): Promise<IExamCandidate> => {
    const response = await api.post<IExamCandidate>('/exam-candidates', data);
    return response.data;
  },

  updateExamCandidate: async (id: number, data: IExamCandidateUpdate): Promise<IExamCandidate> => {
    const response = await api.patch<IExamCandidate>(`/exam-candidates/${id}`, data);
    return response.data;
  },

  deleteExamCandidate: async (id: number): Promise<void> => {
    const response = await api.delete(`/exam-candidates/${id}`);
    return response.data;
  },

  createExamCandidateBulk: async (
    data: ICreateExamCandidateBulk,
  ): Promise<IBaseResponse<IExamCandidate[]>> => {
    const response = await api.post<IBaseResponse<IExamCandidate[]>>('/exam-candidates/bulk', data);
    return response.data;
  },
};
