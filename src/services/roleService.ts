import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IRole, IRoleCreate, IRoleUpdate} from '@/types/role';

import {api} from '@/lib/axios';

export const roleService = {
  // Get all roles with pagination and search
  getRoles: async (params = {}): Promise<IBasePaginatedResponse<IRole>> => {
    const response = await api.get<IBasePaginatedResponse<IRole>>('/roles', { params });
    return response.data;
  },

  // Get a single role by ID
  getRole: async (id: number): Promise<IBaseResponse<IRole>> => {
    const response = await api.get<IBaseResponse<IRole>>(`/roles/${id}`);
    return response.data;
  },

  // Create a new role
  createRole: async (data: IRoleCreate): Promise<IRole> => {
    const response = await api.post<IRole>('/roles', data);
    return response.data;
  },

  // Update an existing role
  updateRole: async (id: number, data: IRoleUpdate): Promise<IRole> => {
    const response = await api.patch<IRole>(`/roles/${id}`, data);
    return response.data;
  },

  // Delete a role
  deleteRole: async (id: number): Promise<void> => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  },
};
