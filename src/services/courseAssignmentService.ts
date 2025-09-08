import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  ICourseAssignment,
  ICourseAssignmentCreate,
  ICourseAssignmentUpdate,
} from '@/types/courseAssignment';

import { api } from '@/lib/axios';

export const courseAssignmentService = {
  getCourseAssignments: async (params = {}): Promise<IBasePaginatedResponse<ICourseAssignment>> => {
    const response = await api.get<IBasePaginatedResponse<ICourseAssignment>>(
      '/course-assignments',
      { params },
    );
    return response.data;
  },

  getCourseAssignment: async (id: number): Promise<ICourseAssignment> => {
    const response = await api.get<IBaseResponse<ICourseAssignment>>(`/course-assignments/${id}`);
    return response.data.data;
  },

  createCourseAssignment: async (data: ICourseAssignmentCreate): Promise<ICourseAssignment> => {
    const response = await api.post<ICourseAssignment>('/course-assignments', data);
    return response.data;
  },

  updateCourseAssignment: async (
    id: number,
    data: ICourseAssignmentUpdate,
  ): Promise<ICourseAssignment> => {
    const response = await api.put<ICourseAssignment>(`/course-assignments/${id}`, data);
    return response.data;
  },

  deleteCourseAssignment: async (id: number): Promise<void> => {
    await api.delete(`/course-assignments/${id}`);
  },
};
