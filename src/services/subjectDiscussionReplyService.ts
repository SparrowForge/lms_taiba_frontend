import { IBaseResponse } from '@/types/common';
import {
  ISubjectDiscussionReply,
  ISubjectDiscussionReplyCreate,
  ISubjectDiscussionReplyUpdate,
} from '@/types/subjectDiscussionReply';

import { api } from '@/lib/axios';

export const subjectDiscussionReplyService = {
  getSubjectDiscussionReply: async (id: number): Promise<ISubjectDiscussionReply> => {
    const response = await api.get<IBaseResponse<ISubjectDiscussionReply>>(
      `/subject-discussions/replies/${id}`,
    );
    return response.data.data;
  },

  createSubjectDiscussionReply: async (
    data: ISubjectDiscussionReplyCreate,
  ): Promise<ISubjectDiscussionReply> => {
    const response = await api.post<IBaseResponse<ISubjectDiscussionReply>>(
      '/subject-discussions/replies',
      data,
    );
    return response.data.data;
  },

  updateSubjectDiscussionReply: async (
    id: number,
    data: ISubjectDiscussionReplyUpdate,
  ): Promise<ISubjectDiscussionReply> => {
    const response = await api.patch<IBaseResponse<ISubjectDiscussionReply>>(
      `/subject-discussions/replies/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteSubjectDiscussionReply: async (id: number): Promise<void> => {
    await api.delete(`/subject-discussions/replies/${id}`);
  },
};
