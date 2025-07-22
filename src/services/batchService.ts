import { api } from '@/lib/axios';
import { IBatch, IBatchCreate, IBatchUpdate } from '@/types/batch';
import { IBasePaginatedResponse } from '@/types/common';

export const batchService = {
  // Get all batches with pagination and search
  getBatches: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<IBasePaginatedResponse<IBatch>> => {
    const response = await api.get<IBasePaginatedResponse<IBatch>>('/batches', { params });
    return response.data;
  },

  // Get a single batch by ID
  getBatch: async (id: number): Promise<IBatch> => {
    const response = await api.get<IBatch>(`/batches/${id}`);
    return response.data;
  },

  // Create a new batch
  createBatch: async (data: IBatchCreate): Promise<IBatch> => {
    const response = await api.post<IBatch>('/batches', data);
    return response.data;
  },

  // Update an existing batch
  updateBatch: async (id: number, data: IBatchUpdate): Promise<IBatch> => {
    const response = await api.put(`/batches/${id}`, data);
    return response.data;
  },

  // Delete a batch
  deleteBatch: async (id: number): Promise<void> => {
    const response = await api.delete(`/batches/${id}`);
    return response.data;
  },
}; 