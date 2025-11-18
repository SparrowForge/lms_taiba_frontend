import {createApi} from '@reduxjs/toolkit/query/react';

import {IMySchedules} from '@/types/classSchedule';
import {IBaseResponse} from '@/types/common';

import {axiosBaseQuery} from '@/lib/axiosBaseQuery';

export const classScheduleApi = createApi({
  reducerPath: 'classScheduleApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['MySchedules'],
  endpoints: (builder) => ({
    // Get my schedules (for current user - faculty or student)
    getMySchedules: builder.query<IBaseResponse<IMySchedules>, void>({
      query: () => ({
        url: '/class-schedules/me',
      }),
      providesTags: [{ type: 'MySchedules', id: 'ME' }],
    }),
  }),
});

// Export hooks for usage in components
export const { useGetMySchedulesQuery, useLazyGetMySchedulesQuery } = classScheduleApi;
