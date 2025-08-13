import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IRoleMenuPermission, IRoleMenuPermissionCreate, IRoleMenuPermissionUpdate,} from '@/types/roleMenuPermission';

import {api} from '@/lib/axios';

export const roleMenuPermissionService = {
  // Get all role menu permissions with pagination and search
  getRoleMenuPermissions: async (
    params = {},
  ): Promise<IBasePaginatedResponse<IRoleMenuPermission>> => {
    const response = await api.get<IBasePaginatedResponse<IRoleMenuPermission>>(
      '/role-menu-permissions',
      { params },
    );
    return response.data;
  },

  // Get a single role menu permission by roleId and menuId
  getRoleMenuPermission: async (id: number): Promise<IBaseResponse<IRoleMenuPermission>> => {
    const response = await api.get<IBaseResponse<IRoleMenuPermission>>(
      `/role-menu-permissions/${id}`,
    );
    return response.data;
  },

  // Create a new role menu permission
  createRoleMenuPermission: async (
    data: IRoleMenuPermissionCreate,
  ): Promise<IRoleMenuPermission> => {
    const response = await api.post<IRoleMenuPermission>('/role-menu-permissions', data);
    return response.data;
  },

  // Update an existing role menu permission
  updateRoleMenuPermission: async (
    id: number,
    data: IRoleMenuPermissionUpdate,
  ): Promise<IRoleMenuPermission> => {
    const response = await api.patch<IRoleMenuPermission>(
      `/role-menu-permissions/${id}`,
      data,
    );
    return response.data;
  },

  // Delete a role menu permission
  deleteRoleMenuPermission: async (id: number): Promise<void> => {
    const response = await api.delete(`/role-menu-permissions/${id}`);
    return response.data;
  },
};
