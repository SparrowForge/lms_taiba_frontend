import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  ISemester,
  ISemesterCreate,
  ISemesterUpdate,
  ISemesterWithSubjectsAndFaculty,
} from '@/types/semester';

import { api } from '@/lib/axios';

export const semesterService = {
  // Get all semesters with pagination and search
  getSemesters: async (params = {}): Promise<IBasePaginatedResponse<ISemester>> => {
    const response = await api.get<IBasePaginatedResponse<ISemester>>('/semesters', { params });
    return response.data;
  },

  // Get a single semester by ID
  getSemester: async (id: number): Promise<IBaseResponse<ISemester>> => {
    const response = await api.get<IBaseResponse<ISemester>>(`/semesters/${id}`);
    return response.data;
  },

  // Create a new semester
  createSemester: async (data: ISemesterCreate): Promise<ISemester> => {
    const response = await api.post<ISemester>('/semesters', data);
    return response.data;
  },

  // Update an existing semester
  updateSemester: async (id: number, data: ISemesterUpdate): Promise<ISemester> => {
    const response = await api.patch<ISemester>(`/semesters/${id}`, data);
    return response.data;
  },

  // Delete a semester
  deleteSemester: async (id: number): Promise<void> => {
    const response = await api.delete(`/semesters/${id}`);
    return response.data;
  },

  // Get semester with subjects and faculty
  getSemesterWithSubjectsAndFaculty: async (
    id: number,
  ): Promise<IBaseResponse<ISemesterWithSubjectsAndFaculty>> => {
    const response = await api.get<IBaseResponse<ISemesterWithSubjectsAndFaculty>>(
      `/semesters/${id}/with-subjects-and-faculty`,
    );
    return response.data;
  },
};
