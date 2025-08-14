import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IStudentProfile, IStudentProfileCreate, IStudentProfileUpdate} from '@/types/studentProfile';

import {api} from '@/lib/axios';

export const studentProfileService = {
  // Get all student profiles with pagination
  getStudentProfiles: async (params = {}): Promise<IBasePaginatedResponse<IStudentProfile>> => {
    const response = await api.get('/student-profiles', { params });
    return response.data;
  },

  // Get a single student profile by ID
  getStudentProfile: async (id: number): Promise<IBaseResponse<IStudentProfile>> => {
    const response = await api.get(`/student-profiles/${id}`);
    return response.data;
  },

  // Create a new student profile
  createStudentProfile: async (data: IStudentProfileCreate): Promise<IStudentProfile> => {
    const response = await api.post('/student-profiles', data);
    return response.data;
  },

  // Update an existing student profile
  updateStudentProfile: async (id: number, data: IStudentProfileUpdate): Promise<IStudentProfile> => {
    const response = await api.put(`/student-profiles/${id}`, data);
    return response.data;
  },

  // Delete a student profile
  deleteStudentProfile: async (id: number): Promise<void> => {
    await api.delete(`/student-profiles/${id}`);
  },
};
