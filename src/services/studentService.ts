import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IStudent,
  IStudentCreate,
  IStudentRegistrationCreate,
  IStudentUpdate,
  IStudentWithFeeInfo,
} from '@/types/student';

import { api } from '@/lib/axios';

export const studentService = {
  getStudents: async (params = {}): Promise<IBasePaginatedResponse<IStudent>> => {
    const response = await api.get('/students', { params });
    return response.data;
  },

  getStudent: async (id: number): Promise<IBaseResponse<IStudent>> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  getStudentWithFeeInfo: async (id: number): Promise<IBaseResponse<IStudentWithFeeInfo>> => {
    const response = await api.get(`/students/${id}?include=fee-info`);
    return response.data;
  },

  createStudent: async (data: IStudentCreate): Promise<IStudent> => {
    const response = await api.post('/students', data);
    return response.data;
  },

  updateStudent: async (id: number, data: Partial<IStudentUpdate>): Promise<IStudent> => {
    const response = await api.patch(`/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id: number): Promise<void> => {
    await api.delete(`/students/${id}`);
  },

  // Get students without user accounts
  getStudentsWithoutUser: async (params = {}): Promise<IBaseResponse<IStudent[]>> => {
    const response = await api.get('/students/without-user', { params });
    return response.data;
  },

  // Public student registration
  registerStudent: async (data: IStudentRegistrationCreate): Promise<IBaseResponse<IStudent>> => {
    const response = await api.post('/public/students/register', data);
    return response.data;
  },
};
