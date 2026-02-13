import { ICostCenter, ICostCenterCreate, ICostCenterUpdate } from '@/types/costCenters';

import { api } from '@/lib/axios';

export const costCentersService = {
  // Get entire tree (hierarchical)
  getTree: async (): Promise<ICostCenter[]> => {
    const response = await api.get<ICostCenter[]>('/cost-centers');
    return response.data;
  },

  // Get flat list
  getList: async (): Promise<ICostCenter[]> => {
    const response = await api.get<ICostCenter[]>('/cost-centers/list');
    return response.data;
  },

  // Get by ID
  getById: async (id: number): Promise<ICostCenter> => {
    const response = await api.get<ICostCenter>(`/cost-centers/${id}`);
    return response.data;
  },

  // Create
  create: async (data: ICostCenterCreate): Promise<ICostCenter> => {
    const response = await api.post<ICostCenter>('/cost-centers', data);
    return response.data;
  },

  // Update
  update: async (id: number, data: ICostCenterUpdate): Promise<ICostCenter> => {
    const response = await api.patch<ICostCenter>(`/cost-centers/${id}`, data);
    return response.data;
  },

  // Delete
  delete: async (id: number): Promise<void> => {
    await api.delete(`/cost-centers/${id}`);
  },
};
