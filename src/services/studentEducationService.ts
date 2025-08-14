import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IStudentEducation, IStudentEducationCreate, IStudentEducationUpdate} from '@/types/studentEducation';

import {api} from '@/lib/axios';

export const studentEducationService = {
  // Get all student educations with pagination
  getStudentEducations: async (params = {}): Promise<IBasePaginatedResponse<IStudentEducation>> => {
    const response = await api.get('/student-educations', { params });
    return response.data;
  },

  // Get a single student education by ID
  getStudentEducation: async (id: number): Promise<IBaseResponse<IStudentEducation>> => {
    const response = await api.get(`/student-educations/${id}`);
    return response.data;
  },

  // Create a new student education
  createStudentEducation: async (data: IStudentEducationCreate): Promise<IStudentEducation> => {
    const response = await api.post('/student-educations', data);
    return response.data;
  },

  // Update an existing student education
  updateStudentEducation: async (id: number, data: IStudentEducationUpdate): Promise<IStudentEducation> => {
    const response = await api.put(`/student-educations/${id}`, data);
    return response.data;
  },

  // Delete a student education
  deleteStudentEducation: async (id: number): Promise<void> => {
    await api.delete(`/student-educations/${id}`);
  },
};
