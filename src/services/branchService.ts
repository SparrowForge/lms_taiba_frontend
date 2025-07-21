import { api } from '@/lib/axios';
import { IBranch, IBranchCreate, IBranchUpdate } from '@/types/branch';
import { IBasePaginatedResponse } from '@/types/common';

export const branchService = {
  // Get all branches with pagination and search
  getBranches: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<IBasePaginatedResponse<IBranch>> => {
    const response = await api.get<IBasePaginatedResponse<IBranch>>('/branches', { params });
    return response.data;
  },

  // Get a single branch by ID
  getBranch: async (id: number): Promise<IBranch> => {
    const response = await api.get<IBranch>(`/branches/${id}`);
    return response.data;
  },

  // Create a new branch
  createBranch: async (data: IBranchCreate): Promise<IBranch> => {
    const response = await api.post<IBranch>('/branches', data);
    return response.data;
  },

  // Update an existing branch
  updateBranch: async (id: number, data: IBranchUpdate): Promise<IBranch> => {
    const response = await api.put(`/branches/${id}`, data);
    return response.data;
  },

  // Delete a branch
  deleteBranch: async (id: number): Promise<void> => {
    const response = await api.delete(`/branches/${id}`);
    return response.data;
  },
}; 