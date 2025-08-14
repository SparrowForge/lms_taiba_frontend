import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {ICourse, ICourseCreate, ICourseUpdate} from '@/types/course';

import {api} from '@/lib/axios';

export const courseService = {
  // Get all courses with pagination and search
  getCourses: async (params = {}): Promise<IBasePaginatedResponse<ICourse>> => {
    const response = await api.get<IBasePaginatedResponse<ICourse>>('/courses', { params });
    return response.data;
  },

  // Get a single course by ID
  getCourse: async (id: number): Promise<IBaseResponse<ICourse>> => {
    const response = await api.get<IBaseResponse<ICourse>>(`/courses/${id}`);
    return response.data;
  },

  // Create a new course
  createCourse: async (data: ICourseCreate): Promise<ICourse> => {
    const response = await api.post<ICourse>('/courses', data);
    return response.data;
  },

  // Update an existing course
  updateCourse: async (id: number, data: ICourseUpdate): Promise<ICourse> => {
    const response = await api.patch<ICourse>(`/courses/${id}`, data);
    return response.data;
  },

  // Delete a course
  deleteCourse: async (id: number): Promise<void> => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};
