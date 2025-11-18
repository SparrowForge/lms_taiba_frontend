import {api} from './axios';

import type {BaseQueryFn} from '@reduxjs/toolkit/query';
import type {AxiosError, AxiosRequestConfig} from 'axios';


/**
 * Custom axios base query for RTK Query
 * Wraps the configured axios instance to work with RTK Query
 * This allows RTK Query to use our axios interceptors and configuration
 */
export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = 'GET', data, params }) => {
    try {
      const result = await api({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
