import { api } from '@/lib/axios';
import {
  IChartOfAccount,
  IChartOfAccountCreate,
  IChartOfAccountUpdate,
} from '@/types/chartOfAccounts';
import { IBaseResponse } from '@/types/common';

export const chartOfAccountsService = {
  // Get entire tree
  getTree: async (): Promise<IBaseResponse<IChartOfAccount[]>> => {
    const response = await api.get<IBaseResponse<IChartOfAccount[]>>('/chart-of-accounts');
    return response.data;
  },

  // Get flat list with pagination (if needed)
  getList: async (params = {}): Promise<IChartOfAccount[]> => {
    const response = await api.get('/chart-of-accounts/list', { params });
    // @ts-ignore
    return response.data.data.items ? response.data.data.items : response.data.data;
  },

  // Get by ID
  getById: async (id: number): Promise<IChartOfAccount> => {
    const response = await api.get<IChartOfAccount>(`/chart-of-accounts/${id}`);
    // @ts-ignore
    return response.data.data;
  },

  // Create
  create: async (data: IChartOfAccountCreate): Promise<IChartOfAccount> => {
    const response = await api.post<IChartOfAccount>('/chart-of-accounts', data);
    // @ts-ignore
    return response.data.data;
  },

  // Update
  update: async (id: number, data: IChartOfAccountUpdate): Promise<IChartOfAccount> => {
    const response = await api.patch<IChartOfAccount>(`/chart-of-accounts/${id}`, data);
    // @ts-ignore
    return response.data.data;
  },

  // Delete
  delete: async (id: number): Promise<void> => {
    await api.delete(`/chart-of-accounts/${id}`);
  },

  // Assign branch to account
  assignBranch: async (accChartId: number, branchId: number): Promise<void> => {
    await api.post('/chart-of-accounts/branch-assign', { accChartId, branchId });
  },

  // Get branches assigned to an account
  getBranches: async (
    accChartId: number,
  ): Promise<{ id: number; branch: { id: number; name: string } }[]> => {
    const response = await api.get(`/chart-of-accounts/${accChartId}/branches`);
    return response.data;
  },

  // Remove a branch assignment
  removeBranchAssignment: async (assignmentId: number): Promise<void> => {
    await api.delete(`/chart-of-accounts/branch-assign/${assignmentId}`);
  },
};
