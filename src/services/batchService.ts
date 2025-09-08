import {
  IBatch,
  IBatchCreate,
  IBatchUpdate,
  IBatchWithSemestersCreate,
  IBatchWithSemestersUpdate,
} from '@/types/batch';
import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';

import { api } from '@/lib/axios';

export const batchService = {
  // Get all batches with pagination and search
  getBatches: async (params = {}): Promise<IBasePaginatedResponse<IBatch>> => {
    const response = await api.get<IBasePaginatedResponse<IBatch>>('/batches', { params });
    return response.data;
  },

  // Get a single batch by ID
  getBatch: async (id: number): Promise<IBaseResponse<IBatch>> => {
    const response = await api.get<IBaseResponse<IBatch>>(`/batches/${id}`);
    return response.data;
  },

  // Create a new batch
  createBatch: async (data: IBatchCreate): Promise<IBatch> => {
    const response = await api.post<IBatch>('/batches', data);
    return response.data;
  },

  // Create a new batch with semesters in a single API call
  createBatchWithSemesters: async (data: IBatchWithSemestersCreate): Promise<IBatch> => {
    const response = await api.post<IBatch>('/batches/batches-with-semesters', data);
    return response.data;
  },

  // Update an existing batch
  updateBatch: async (id: number, data: IBatchUpdate): Promise<IBatch> => {
    const response = await api.patch<IBatch>(`/batches/${id}`, data);
    return response.data;
  },

  // Update an existing batch with semesters in a single API call
  updateBatchWithSemesters: async (
    id: number,
    data: IBatchWithSemestersUpdate,
  ): Promise<IBatch> => {
    const response = await api.patch<IBatch>(`/batches/${id}/batches-with-semesters`, data);
    return response.data;
  },

  // Delete a batch
  deleteBatch: async (id: number): Promise<void> => {
    const response = await api.delete(`/batches/${id}`);
    return response.data;
  },
};
