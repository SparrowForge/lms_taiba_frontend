import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { ISubject, ISubjectCreate, ISubjectUpdate } from '@/types/subject';

import { api } from '@/lib/axios';

export const subjectService = {
  // Get all subjects with pagination and search
  getSubjects: async (params = {}): Promise<IBasePaginatedResponse<ISubject>> => {
    const response = await api.get<IBasePaginatedResponse<ISubject>>('/subjects', { params });
    return response.data;
  },

  // Get a single subject by ID
  getSubject: async (id: number): Promise<IBaseResponse<ISubject>> => {
    const response = await api.get<IBaseResponse<ISubject>>(`/subjects/${id}`);
    return response.data;
  },

  // Create a new subject
  createSubject: async (data: ISubjectCreate): Promise<ISubject> => {
    const response = await api.post<ISubject>('/subjects', data);
    return response.data;
  },

  // Update an existing subject
  updateSubject: async (id: number, data: ISubjectUpdate): Promise<ISubject> => {
    const response = await api.patch<ISubject>(`/subjects/${id}`, data);
    return response.data;
  },

  // Delete a subject
  deleteSubject: async (id: number): Promise<void> => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },
};
