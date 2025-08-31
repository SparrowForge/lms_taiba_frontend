import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {ICourseMaterial, ICourseMaterialCreate, ICourseMaterialUpdate} from '@/types/courseMaterial';

import {api} from '@/lib/axios';

export const courseMaterialService = {
  getCourseMaterials: async (params = {}): Promise<IBasePaginatedResponse<ICourseMaterial>> => {
    const response = await api.get<IBasePaginatedResponse<ICourseMaterial>>('/course-materials', { params });
    return response.data;
  },

  getCourseMaterial: async (id: number): Promise<ICourseMaterial> => {
    const response = await api.get<IBaseResponse<ICourseMaterial>>(`/course-materials/${id}`);
    return response.data.data;
  },

  createCourseMaterial: async (data: ICourseMaterialCreate): Promise<ICourseMaterial> => {
    const response = await api.post<IBaseResponse<ICourseMaterial>>('/course-materials', data);
    return response.data.data;
  },

  updateCourseMaterial: async (id: number, data: ICourseMaterialUpdate): Promise<ICourseMaterial> => {
    const response = await api.put<IBaseResponse<ICourseMaterial>>(`/course-materials/${id}`, data);
    return response.data.data;
  },

  deleteCourseMaterial: async (id: number): Promise<void> => {
    await api.delete(`/course-materials/${id}`);
  },
};
