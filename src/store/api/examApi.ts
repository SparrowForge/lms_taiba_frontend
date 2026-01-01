import {createApi} from '@reduxjs/toolkit/query/react';

import {IBasePaginatedResponse} from '@/types/common';
import {IExam} from '@/types/exam';

import {axiosBaseQuery} from '@/lib/axiosBaseQuery';

export const examApi = createApi({
  reducerPath: 'examApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['MyExams'],
  endpoints: (builder) => ({
    // Get my exams (for current user - faculty or student)
    getMyExams: builder.query<IBasePaginatedResponse<IExam>, Record<string, any> | void>({
      query: (params) => ({
        url: '/exams/me',
        params: params || {},
      }),
      providesTags: [{ type: 'MyExams', id: 'ME' }],
    }),
  }),
});

// Export hooks for usage in components
export const { useGetMyExamsQuery, useLazyGetMyExamsQuery } = examApi;

