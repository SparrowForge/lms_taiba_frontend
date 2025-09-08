import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {
    ICourseAssignmentSubmission,
    ICourseAssignmentSubmissionCreate,
    ICourseAssignmentSubmissionUpdate,
} from '@/types/courseAssignmentSubmission';

import {api} from '@/lib/axios';

export const courseAssignmentSubmissionService = {
  getCourseAssignmentSubmissions: async (
    params = {},
  ): Promise<IBasePaginatedResponse<ICourseAssignmentSubmission>> => {
    const response = await api.get<IBasePaginatedResponse<ICourseAssignmentSubmission>>(
      '/course-assignment-submissions',
      { params },
    );
    return response.data;
  },

  getCourseAssignmentSubmission: async (id: number): Promise<ICourseAssignmentSubmission> => {
    const response = await api.get<IBaseResponse<ICourseAssignmentSubmission>>(
      `/course-assignment-submissions/${id}`,
    );
    return response.data.data;
  },

  createCourseAssignmentSubmission: async (
    data: ICourseAssignmentSubmissionCreate,
  ): Promise<ICourseAssignmentSubmission> => {
    const response = await api.post<ICourseAssignmentSubmission>(
      '/course-assignment-submissions',
      data,
    );
    return response.data;
  },

  updateCourseAssignmentSubmission: async (
    id: number,
    data: ICourseAssignmentSubmissionUpdate,
  ): Promise<ICourseAssignmentSubmission> => {
    const response = await api.put<ICourseAssignmentSubmission>(
      `/course-assignment-submissions/${id}`,
      data,
    );
    return response.data;
  },

  deleteCourseAssignmentSubmission: async (id: number): Promise<void> => {
    await api.delete(`/course-assignment-submissions/${id}`);
  },
};
