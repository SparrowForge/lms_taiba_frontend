import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IMCQQuestion,
  IMCQQuestionBulkCreate,
  IMCQQuestionCreate,
  IMCQQuestionUpdate,
} from '@/types/mcqQuestion';

import { api } from '@/lib/axios';

export const mcqQuestionService = {
  // Get all MCQ questions with pagination and search
  getMcqQuestions: async (params = {}): Promise<IBasePaginatedResponse<IMCQQuestion>> => {
    const response = await api.get<IBasePaginatedResponse<IMCQQuestion>>('/mcq-questions', {
      params,
    });
    return response.data;
  },

  // Get a single MCQ question by ID
  getMcqQuestion: async (id: number): Promise<IBaseResponse<IMCQQuestion>> => {
    const response = await api.get<IBaseResponse<IMCQQuestion>>(`/mcq-questions/${id}`);
    return response.data;
  },

  // Create a new MCQ question
  createMcqQuestion: async (data: IMCQQuestionCreate): Promise<IMCQQuestion> => {
    const response = await api.post<IMCQQuestion>('/mcq-questions', data);
    return response.data;
  },

  // Create multiple MCQ questions
  createBulkMcqQuestions: async (data: IMCQQuestionBulkCreate): Promise<IMCQQuestion[]> => {
    const response = await api.post<IMCQQuestion[]>('/mcq-questions/bulk', data);
    return response.data;
  },

  // Update an existing MCQ question
  updateMcqQuestion: async (id: number, data: IMCQQuestionUpdate): Promise<IMCQQuestion> => {
    const response = await api.patch<IMCQQuestion>(`/mcq-questions/${id}`, data);
    return response.data;
  },

  // Delete an MCQ question
  deleteMcqQuestion: async (id: number): Promise<void> => {
    const response = await api.delete(`/mcq-questions/${id}`);
    return response.data;
  },
};

