import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  ISemesterSubject,
  ISemesterSubjectCreate,
  ISemesterSubjectMultipleCreate,
  ISemesterSubjectUpdate,
} from '@/types/semesterSubject';

import { api } from '@/lib/axios';

export const semesterSubjectService = {
  // Get all semester subjects with pagination and search
  getSemesterSubjects: async (params = {}): Promise<IBasePaginatedResponse<ISemesterSubject>> => {
    const response = await api.get<IBasePaginatedResponse<ISemesterSubject>>('/semester-subjects', {
      params,
    });
    return response.data;
  },

  // Get a single semester subject by ID
  getSemesterSubject: async (id: number): Promise<IBaseResponse<ISemesterSubject>> => {
    const response = await api.get<IBaseResponse<ISemesterSubject>>(`/semester-subjects/${id}`);
    return response.data;
  },

  // Create a new semester subject
  createSemesterSubject: async (data: ISemesterSubjectCreate): Promise<ISemesterSubject> => {
    const response = await api.post<ISemesterSubject>('/semester-subjects', data);
    return response.data;
  },

  // Create multiple semester subjects with faculty assignments
  createMultipleSemesterSubjects: async (
    data: ISemesterSubjectMultipleCreate,
  ): Promise<ISemesterSubject[]> => {
    const response = await api.post<ISemesterSubject[]>(
      '/semester-subjects/bulk-subject-faculty',
      data,
    );
    return response.data;
  },

  // Update an existing semester subject
  updateSemesterSubject: async (
    id: number,
    data: ISemesterSubjectUpdate,
  ): Promise<ISemesterSubject> => {
    const response = await api.patch<ISemesterSubject>(`/semester-subjects/${id}`, data);
    return response.data;
  },

  // Delete a semester subject
  deleteSemesterSubject: async (id: number): Promise<void> => {
    const response = await api.delete(`/semester-subjects/${id}`);
    return response.data;
  },
};
