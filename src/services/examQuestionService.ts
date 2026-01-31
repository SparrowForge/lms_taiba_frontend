import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IExamQuestion,
  IExamQuestionBulkCreate,
  IExamQuestionCreate,
  IExamQuestionMultipleCreate,
  IExamQuestionUpdate,
} from '@/types/examQuestion';

import { api } from '@/lib/axios';

export const examQuestionService = {
  getExamQuestions: async (params = {}): Promise<IBasePaginatedResponse<IExamQuestion>> => {
    const response = await api.get<IBasePaginatedResponse<IExamQuestion>>(
      '/exam-questions',
      { params },
    );
    return response.data;
  },

  getExamQuestion: async (id: number): Promise<IBaseResponse<IExamQuestion>> => {
    const response = await api.get<IBaseResponse<IExamQuestion>>(`/exam-questions/${id}`);
    return response.data;
  },

  createExamQuestion: async (data: IExamQuestionCreate): Promise<IExamQuestion> => {
    const response = await api.post<IExamQuestion>('/exam-questions', data);
    return response.data;
  },

  createMultipleExamQuestion: async (
    data: IExamQuestionBulkCreate,
  ): Promise<IExamQuestion[]> => {
    const response = await api.post<IExamQuestion[]>(
      '/exam-questions/bulk',
      data,
    );
    return response.data;
  },

  updateExamQuestion: async (
    id: number,
    data: IExamQuestionUpdate,
  ): Promise<IExamQuestion> => {
    const response = await api.patch<IExamQuestion>(`/exam-questions/${id}`, data);
    return response.data;
  },

  deleteExamQuestion: async (id: number): Promise<void> => {
    await api.delete(`/exam-questions/${id}`);
  },
};
