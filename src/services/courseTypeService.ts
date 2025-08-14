import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {ICourseType, ICourseTypeCreate, ICourseTypeUpdate} from '@/types/courseType';

import {api} from '@/lib/axios';

export const courseTypeService = {
  getCourseTypes: async (params = {}): Promise<IBasePaginatedResponse<ICourseType>> => {
    const response = await api.get<IBasePaginatedResponse<ICourseType>>('/course-types', {
      params,
    });
    return response.data;
  },

  getCourseType: async (id: number): Promise<IBaseResponse<ICourseType>> => {
    const response = await api.get<IBaseResponse<ICourseType>>(`/course-types/${id}`);
    return response.data;
  },

  createCourseType: async (data: ICourseTypeCreate): Promise<ICourseType> => {
    const response = await api.post<ICourseType>('/course-types', data);
    return response.data;
  },

  updateCourseType: async (id: number, data: ICourseTypeUpdate): Promise<ICourseType> => {
    const response = await api.patch<ICourseType>(`/course-types/${id}`, data);
    return response.data;
  },

  deleteCourseType: async (id: number): Promise<void> => {
    const response = await api.delete(`/course-types/${id}`);
    return response.data;
  },
};
