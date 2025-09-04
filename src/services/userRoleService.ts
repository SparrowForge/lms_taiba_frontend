import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {
    IUserRole,
    IUserRoleBulkCreate,
    IUserRoleBulkCreateResponse,
    IUserRoleCreate,
    IUserRoleUpdate,
} from '@/types/userRole';

import {api} from '@/lib/axios';

export const userRoleService = {
  // Get all user roles with pagination and search
  getUserRoles: async (params = {}): Promise<IBasePaginatedResponse<IUserRole>> => {
    const response = await api.get<IBasePaginatedResponse<IUserRole>>('/user-roles', { params });
    return response.data;
  },

  // Get a single user role by ID
  getUserRole: async (id: number): Promise<IBaseResponse<IUserRole>> => {
    const response = await api.get<IBaseResponse<IUserRole>>(`/user-roles/${id}`);
    return response.data;
  },

  // Create a new user role
  createUserRole: async (data: IUserRoleCreate): Promise<IUserRole> => {
    const response = await api.post<IUserRole>('/user-roles', data);
    return response.data;
  },

  // Create multiple user roles for a single user
  createUserRolesBulk: async (
    data: IUserRoleBulkCreate,
  ): Promise<IBaseResponse<IUserRoleBulkCreateResponse>> => {
    const response = await api.post<IBaseResponse<IUserRoleBulkCreateResponse>>(
      '/user-roles/bulk',
      data,
    );
    return response.data;
  },

  // Update an existing user role
  updateUserRole: async (id: number, data: IUserRoleUpdate): Promise<IUserRole> => {
    const response = await api.put<IUserRole>(`/user-roles/${id}`, data);
    return response.data;
  },

  // Delete a user role
  deleteUserRole: async (id: number): Promise<void> => {
    const response = await api.delete(`/user-roles/${id}`);
    return response.data;
  },
};
