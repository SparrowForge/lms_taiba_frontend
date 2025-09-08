import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IStudent, IStudentCreate, IStudentUpdate} from '@/types/student';

import {api} from '@/lib/axios';

export const studentService = {
  getStudents: async (params = {}): Promise<IBasePaginatedResponse<IStudent>> => {
    const response = await api.get('/students', { params });
    return response.data;
  },

  getStudent: async (id: number): Promise<IBaseResponse<IStudent>> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  createStudent: async (data: IStudentCreate): Promise<IStudent> => {
    const response = await api.post('/students', data);
    return response.data;
  },

  updateStudent: async (id: number, data: IStudentUpdate): Promise<IStudent> => {
    const response = await api.patch(`/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id: number): Promise<void> => {
    await api.delete(`/students/${id}`);
  },
};
