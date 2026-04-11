import { IBaseResponse } from '@/types/common';
import { ICostCenter, ICostCenterCreate, ICostCenterUpdate } from '@/types/costCenters';

import { api } from '@/lib/axios';

export const costCentersService = {
  // Get entire tree (hierarchical)
  getTree: async (): Promise<IBaseResponse<ICostCenter[]>> => {
    const response = await api.get<IBaseResponse<ICostCenter[]>>('/cost-centers');
    return response.data;
  },

  // Get flat list
  getList: async (): Promise<ICostCenter[]> => {
    const response = await api.get<ICostCenter[]>('/cost-centers/list');
    // @ts-ignore
    return response.data.data;
  },

  // Get by ID
  getById: async (id: number): Promise<ICostCenter> => {
    const response = await api.get<ICostCenter>(`/cost-centers/${id}`);
    // @ts-ignore
    return response.data.data;
  },

  // Create
  create: async (data: ICostCenterCreate): Promise<ICostCenter> => {
    const response = await api.post<ICostCenter>('/cost-centers', data);
    // @ts-ignore
    return response.data.data;
  },

  // Update
  update: async (id: number, data: ICostCenterUpdate): Promise<ICostCenter> => {
    const response = await api.patch<ICostCenter>(`/cost-centers/${id}`, data);
    // @ts-ignore
    return response.data.data;
  },

  // Delete
  delete: async (id: number): Promise<void> => {
    await api.delete(`/cost-centers/${id}`);
  },
};
