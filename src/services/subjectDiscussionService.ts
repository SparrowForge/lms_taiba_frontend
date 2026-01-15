import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  ISubjectDiscussion,
  ISubjectDiscussionCreate,
  ISubjectDiscussionUpdate,
} from '@/types/subjectDiscussion';

import { api } from '@/lib/axios';

export const subjectDiscussionService = {
  getSubjectDiscussions: async (
    params = {},
  ): Promise<IBasePaginatedResponse<ISubjectDiscussion>> => {
    const response = await api.get<IBasePaginatedResponse<ISubjectDiscussion>>('/subject-discussions', {
      params,
    });
    return response.data;
  },

  getSubjectDiscussion: async (id: number): Promise<ISubjectDiscussion> => {
    const response = await api.get<IBaseResponse<ISubjectDiscussion>>(`/subject-discussions/${id}`);
    return response.data.data;
  },

  createSubjectDiscussion: async (
    data: ISubjectDiscussionCreate,
  ): Promise<ISubjectDiscussion> => {
    const response = await api.post<IBaseResponse<ISubjectDiscussion>>('/subject-discussions', data);
    return response.data.data;
  },

  updateSubjectDiscussion: async (
    id: number,
    data: ISubjectDiscussionUpdate,
  ): Promise<ISubjectDiscussion> => {
    const response = await api.patch<IBaseResponse<ISubjectDiscussion>>(
      `/subject-discussions/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteSubjectDiscussion: async (id: number): Promise<void> => {
    await api.delete(`/subject-discussions/${id}`);
  },
};
