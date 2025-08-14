import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IFaculty, IFacultyCreate, IFacultyUpdate} from '@/types/faculty';

import {api} from '@/lib/axios';

export const facultyService = {
  // Get all faculty with pagination and search
  getFaculties: async (params = {}): Promise<IBasePaginatedResponse<IFaculty>> => {
    const response = await api.get<IBasePaginatedResponse<IFaculty>>('/faculty', { params });
    return response.data;
  },

  // Get a single faculty by ID
  getFaculty: async (id: number): Promise<IBaseResponse<IFaculty>> => {
    const response = await api.get<IBaseResponse<IFaculty>>(`/faculty/${id}`);
    return response.data;
  },

  // Create a new faculty
  createFaculty: async (data: IFacultyCreate): Promise<IFaculty> => {
    const response = await api.post<IFaculty>('/faculty', data);
    return response.data;
  },

  // Update an existing faculty
  updateFaculty: async (id: number, data: IFacultyUpdate): Promise<IFaculty> => {
    const response = await api.patch<IFaculty>(`/faculty/${id}`, data);
    return response.data;
  },

  // Delete a faculty
  deleteFaculty: async (id: number): Promise<void> => {
    const response = await api.delete(`/faculty/${id}`);
    return response.data;
  },
};
