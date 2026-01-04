import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IExam, IExamCreate, IExamUpdate, IExamWithQuestionSetCreate } from '@/types/exam';

import { api } from '@/lib/axios';

export const examService = {
  getExams: async (params = {}): Promise<IBasePaginatedResponse<IExam>> => {
    const response = await api.get('/exams', { params });
    return response.data;
  },

  getExam: async (id: number): Promise<IBaseResponse<IExam>> => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  createExam: async (data: IExamCreate): Promise<IBaseResponse<IExam>> => {
    const response = await api.post('/exams', data);
    return response.data;
  },

  updateExam: async (id: number, data: IExamUpdate): Promise<IBaseResponse<IExam>> => {
    const response = await api.put(`/exams/${id}`, data);
    return response.data;
  },

  createExamWithQuestionSet: async (id: number,questionSetId:number, data: IExamWithQuestionSetCreate, ): Promise<IBaseResponse<IExam>> => {
    const response = await api.patch(`/exams/${id}/select-question-set/${questionSetId}`, data);
    return response.data;
  },

  deleteExam: async (id: number): Promise<IBaseResponse<void>> => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },
};
