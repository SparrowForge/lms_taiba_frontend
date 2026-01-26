import { createApi } from '@reduxjs/toolkit/query/react';

import { IBaseResponse } from '@/types/common';
import { IAdminStatistics } from '@/types/adminStats';

import { axiosBaseQuery } from '@/lib/axiosBaseQuery';

export const adminStatsApi = createApi({
  reducerPath: 'adminStatsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['AdminStats'],
  endpoints: (builder) => ({
    // Get admin statistics
    getAdminStats: builder.query<IBaseResponse<IAdminStatistics>, void>({
      query: () => ({
        url: '/admin/stats',
      }),
      providesTags: [{ type: 'AdminStats', id: 'LIST' }],
    }),
  }),
});

// Export hooks for usage in components
export const { useGetAdminStatsQuery, useLazyGetAdminStatsQuery } = adminStatsApi;
