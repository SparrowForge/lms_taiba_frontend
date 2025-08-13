import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IStudentFamily, IStudentFamilyCreate, IStudentFamilyUpdate} from '@/types/studentFamily';

import {api} from '@/lib/axios';

export const studentFamilyService = {
  // Get all student families with pagination
  getStudentFamilies: async (params = {}): Promise<IBasePaginatedResponse<IStudentFamily>> => {
    const response = await api.get('/student-families', { params });
    return response.data;
  },

  // Get a single student family by ID
  getStudentFamily: async (id: number): Promise<IBaseResponse<IStudentFamily>> => {
    const response = await api.get(`/student-families/${id}`);
    return response.data;
  },

  // Create a new student family
  createStudentFamily: async (data: IStudentFamilyCreate): Promise<IStudentFamily> => {
    const response = await api.post('/student-families', data);
    return response.data;
  },

  // Update an existing student family
  updateStudentFamily: async (id: number, data: IStudentFamilyUpdate): Promise<IStudentFamily> => {
    const response = await api.put(`/student-families/${id}`, data);
    return response.data;
  },

  // Delete a student family
  deleteStudentFamily: async (id: number): Promise<void> => {
    await api.delete(`/student-families/${id}`);
  },
};
