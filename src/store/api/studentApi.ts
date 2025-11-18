import {createApi} from '@reduxjs/toolkit/query/react';

import {IBaseResponse} from '@/types/common';
import {IStudent, IStudentSubjects} from '@/types/student';

import {axiosBaseQuery} from '@/lib/axiosBaseQuery';

export const studentApi = createApi({
  reducerPath: 'studentApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Student', 'StudentSubjects'],
  endpoints: (builder) => ({
    // Get current student profile
    getMe: builder.query<IBaseResponse<IStudent>, void>({
      query: () => ({
        url: '/students/me',
      }),
      providesTags: [{ type: 'Student', id: 'ME' }],
    }),

    // Get my subjects (for current student user)
    getMySubjects: builder.query<IBaseResponse<IStudentSubjects>, number | undefined>({
      query: (semesterId) => ({
        url: '/students/me/subjects',
        params: semesterId ? { semesterId } : {},
      }),
      providesTags: (result, error, semesterId) => [
        { type: 'StudentSubjects', id: semesterId || 'CURRENT' },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetMySubjectsQuery,
  useLazyGetMySubjectsQuery,
} = studentApi;
