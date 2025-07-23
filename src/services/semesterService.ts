import {api} from '@/lib/axios';
import {ISemester, ISemesterCreate, ISemesterUpdate} from '@/types/semester';
import {IBasePaginatedResponse} from '@/types/common';

export const semesterService = {
  // Get all semesters with pagination and search
  getSemesters: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<IBasePaginatedResponse<ISemester>> => {
    const response = await api.get<IBasePaginatedResponse<ISemester>>('/semesters', { params });
    return response.data;
  },

  // Get a single semester by ID
  getSemester: async (id: number): Promise<ISemester> => {
    const response = await api.get<ISemester>(`/semesters/${id}`);
    return response.data;
  },

  // Create a new semester
  createSemester: async (data: ISemesterCreate): Promise<ISemester> => {
    const response = await api.post<ISemester>('/semesters', data);
    return response.data;
  },

  // Update an existing semester
  updateSemester: async (id: number, data: ISemesterUpdate): Promise<ISemester> => {
    const response = await api.put(`/semesters/${id}`, data);
    return response.data;
  },

  // Delete a semester
  deleteSemester: async (id: number): Promise<void> => {
    const response = await api.delete(`/semesters/${id}`);
    return response.data;
  },
};
