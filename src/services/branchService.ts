import { IBranch, IBranchCreate, IBranchUpdate } from '@/types/branch';
import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';

import { api } from '@/lib/axios';

export const branchService = {
  // Get all branches with pagination and search
  getBranches: async (params = {}): Promise<IBasePaginatedResponse<IBranch>> => {
    const response = await api.get<IBasePaginatedResponse<IBranch>>('/branches', { params });
    return response.data;
  },

  // Get a single branch by ID
  getBranch: async (id: number): Promise<IBaseResponse<IBranch>> => {
    const response = await api.get<IBaseResponse<IBranch>>(`/branches/${id}`);
    return response.data;
  },

  // Create a new branch
  createBranch: async (data: IBranchCreate): Promise<IBranch> => {
    const response = await api.post<IBranch>('/branches', data);
    return response.data;
  },

  // Update an existing branch
  updateBranch: async (id: number, data: IBranchUpdate): Promise<IBranch> => {
    const response = await api.patch<IBranch>(`/branches/${id}`, data);
    return response.data;
  },

  // Delete a branch
  deleteBranch: async (id: number): Promise<void> => {
    const response = await api.delete(`/branches/${id}`);
    return response.data;
  },
};
