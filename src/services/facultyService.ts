import {api} from '@/lib/axios';
import {IFaculty, IFacultyCreate, IFacultyUpdate} from '@/types/faculty';
import {IBasePaginatedResponse} from '@/types/common';

export const facultyService = {
  // Get all faculty with pagination and search
  getFaculties: async (params = {}): Promise<IBasePaginatedResponse<IFaculty>> => {
    const response = await api.get<IBasePaginatedResponse<IFaculty>>('/faculty', { params });
    return response.data;
  },

  // Get a single faculty by ID
  getFaculty: async (id: number): Promise<IFaculty> => {
    const response = await api.get<IFaculty>(`/faculty/${id}`);
    return response.data;
  },

  // Create a new faculty
  createFaculty: async (data: IFacultyCreate): Promise<IFaculty> => {
    const response = await api.post<IFaculty>('/faculty', data);
    return response.data;
  },

  // Update an existing faculty
  updateFaculty: async (id: number, data: IFacultyUpdate): Promise<IFaculty> => {
    const response = await api.put<IFaculty>(`/faculty/${id}`, data);
    return response.data;
  },

  // Delete a faculty
  deleteFaculty: async (id: number): Promise<void> => {
    const response = await api.delete(`/faculty/${id}`);
    return response.data;
  },
}; 