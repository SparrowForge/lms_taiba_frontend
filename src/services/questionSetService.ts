import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IQuestionSet,
  IQuestionSetCreate,
  IQuestionSetUpdate,
  IQuestionSetWithQuestionsCreate,
} from '@/types/questionSet';

import { api } from '@/lib/axios';

export const questionSetService = {
  // Get all question sets with pagination and search
  getQuestionSets: async (params = {}): Promise<IBasePaginatedResponse<IQuestionSet>> => {
    const response = await api.get<IBasePaginatedResponse<IQuestionSet>>('/question-sets', {
      params,
    });
    return response.data;
  },

  // Get a single question set by ID
  getQuestionSet: async (id: number): Promise<IBaseResponse<IQuestionSet>> => {
    const response = await api.get<IBaseResponse<IQuestionSet>>(`/question-sets/${id}`);
    return response.data;
  },

  // Create a new question set
  createQuestionSet: async (data: IQuestionSetCreate): Promise<IQuestionSet> => {
    const response = await api.post<IQuestionSet>('/question-sets', data);
    return response.data;
  },

  // Create a question set with questions
  createQuestionSetWithQuestions: async (
    data: IQuestionSetWithQuestionsCreate,
  ): Promise<IQuestionSet> => {
    const response = await api.post<IQuestionSet>('/question-sets/with-questions', data);
    return response.data;
  },

  // Update an existing question set
  updateQuestionSet: async (id: number, data: IQuestionSetUpdate): Promise<IQuestionSet> => {
    const response = await api.patch<IQuestionSet>(`/question-sets/${id}`, data);
    return response.data;
  },

  // Delete a question set
  deleteQuestionSet: async (id: number): Promise<void> => {
    const response = await api.delete(`/question-sets/${id}`);
    return response.data;
  },
};

