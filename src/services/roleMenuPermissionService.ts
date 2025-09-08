import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {
    IRoleMenuPermission,
    IRoleMenuPermissionCreate,
    IRoleMenuPermissionUpdate,
    IRoleWithMenuPermission,
} from '@/types/roleMenuPermission';

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

  // Get a single role menu permission by id
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
    const response = await api.patch<IRoleMenuPermission>(`/role-menu-permissions/${id}`, data);
    return response.data;
  },

  // Delete a role menu permission
  deleteRoleMenuPermission: async (id: number): Promise<void> => {
    const response = await api.delete(`/role-menu-permissions/${id}`);
    return response.data;
  },

  // Get all roles with their menu permissions
  getRolesWithPermissions: async (): Promise<IBaseResponse<IRoleWithMenuPermission[]>> => {
    const response = await api.get<IBaseResponse<IRoleWithMenuPermission[]>>(
      '/role-menu-permissions/roles-with-permissions',
    );
    return response.data;
  },

  // Bulk update role menu permissions (replace all permissions for a role)
  bulkUpdateRoleMenuPermissions: async (data: {
    roleId: number;
    permissions: Array<{
      menuId: number;
      view: boolean;
      insert: boolean;
      update: boolean;
      delete: boolean;
    }>;
  }): Promise<IBaseResponse<any>> => {
    const response = await api.post<IBaseResponse<any>>('/role-menu-permissions/bulk', data);
    return response.data;
  },
};
