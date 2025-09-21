import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IExamMCQQuestion,
  IExamMCQQuestionCreate,
  IExamMCQQuestionUpdate,
} from '@/types/examMCQQuestion';

import { api } from '@/lib/axios';

export const examMCQQuestionService = {
  getExamMCQQuestions: async (params = {}): Promise<IBasePaginatedResponse<IExamMCQQuestion>> => {
    const response = await api.get<IBasePaginatedResponse<IExamMCQQuestion>>(
      '/exam-mcq-questions',
      { params },
    );
    return response.data;
  },

  getExamMCQQuestion: async (id: number): Promise<IBaseResponse<IExamMCQQuestion>> => {
    const response = await api.get<IBaseResponse<IExamMCQQuestion>>(`/exam-mcq-questions/${id}`);
    return response.data;
  },

  createExamMCQQuestion: async (data: IExamMCQQuestionCreate): Promise<IExamMCQQuestion> => {
    const response = await api.post<IExamMCQQuestion>('/exam-mcq-questions', data);
    return response.data;
  },

  updateExamMCQQuestion: async (
    id: number,
    data: IExamMCQQuestionUpdate,
  ): Promise<IExamMCQQuestion> => {
    const response = await api.patch<IExamMCQQuestion>(`/exam-mcq-questions/${id}`, data);
    return response.data;
  },

  deleteExamMCQQuestion: async (id: number): Promise<void> => {
    const response = await api.delete(`/exam-mcq-questions/${id}`);
    return response.data;
  },
};
