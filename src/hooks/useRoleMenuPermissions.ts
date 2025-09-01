import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse, Status} from '@/types/common';
import {
    IRoleMenuPermission,
    IRoleMenuPermissionCreate,
    IRoleMenuPermissionUpdate,
    IRoleWithMenuPermission
} from '@/types/roleMenuPermission';

import {roleMenuPermissionService} from '@/services/roleMenuPermissionService';

import {
    clearActionStatus,
    clearDetailsStatus,
    deleteRoleMenuPermission,
    setActionStatus,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setRoleMenuPermissions,
    setRolesWithPermissions,
    setRolesWithPermissionsStatus,
    setSelectedRoleMenuPermission,
    updateRoleMenuPermission,
} from '@/store/slices/roleMenuPermissionSlice';

export const useRoleMenuPermissions = () => {
  const dispatch = useDispatch();
  const {
    roleMenuPermissions,
    selectedRoleMenuPermission,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
    rolesWithPermissionsStatus,
    rolesWithPermissions,
  } = useSelector((state: RootState) => state.roleMenuPermissions);

  // Load role menu permissions with pagination and search
  const loadRoleMenuPermissions = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IRoleMenuPermission> =
          await roleMenuPermissionService.getRoleMenuPermissions(params);
        dispatch(setRoleMenuPermissions(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load role menu permissions'
            : 'Failed to load role menu permissions';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single role menu permission
  const loadRoleMenuPermission = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IRoleMenuPermission> =
          await roleMenuPermissionService.getRoleMenuPermission(id);
        dispatch(setSelectedRoleMenuPermission(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load role menu permission'
            : 'Failed to load role menu permission';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load roles with their menu permissions
  const loadRolesWithPermissions = useCallback(
    async () => {
      try {
        dispatch(setRolesWithPermissionsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IRoleWithMenuPermission[]> =
          await roleMenuPermissionService.getRolesWithPermissions();
        dispatch(setRolesWithPermissions(response.data));
        dispatch(setRolesWithPermissionsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load roles with permissions'
            : 'Failed to load roles with permissions';
        dispatch(setRolesWithPermissionsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new role menu permission
  const createRoleMenuPermission = useCallback(
    async (data: IRoleMenuPermissionCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await roleMenuPermissionService.createRoleMenuPermission(data);
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create role menu permission'
            : 'Failed to create role menu permission';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Bulk update role menu permissions (replace all permissions for a role)
  const bulkUpdateRoleMenuPermissions = useCallback(
    async (data: {
      roleId: number;
      permissions: Array<{
        menuId: number;
        view: boolean;
        insert: boolean;
        update: boolean;
        delete: boolean;
      }>;
    }) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await roleMenuPermissionService.bulkUpdateRoleMenuPermissions(data);
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update role menu permissions'
            : 'Failed to update role menu permissions';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing role menu permission
  const editRoleMenuPermission = useCallback(
    async (id: number, data: IRoleMenuPermissionUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IRoleMenuPermission =
          await roleMenuPermissionService.updateRoleMenuPermission(id, data);
        dispatch(updateRoleMenuPermission(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Role menu permission updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update role menu permission'
            : 'Failed to update role menu permission';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a role menu permission
  const removeRoleMenuPermission = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await roleMenuPermissionService.deleteRoleMenuPermission(id);
        dispatch(deleteRoleMenuPermission(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Role menu permission deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete role menu permission'
            : 'Failed to delete role menu permission';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get role menu permission by roleId and menuId from the current list
  const getRoleMenuPermissionById = useCallback(
    (id: number) => {
      if (selectedRoleMenuPermission && selectedRoleMenuPermission.id === id) {
        return;
      }

      const roleMenuPermission = roleMenuPermissions.find((item) => item.id === id);
      if (roleMenuPermission) {
        dispatch(setSelectedRoleMenuPermission(roleMenuPermission));
      } else {
        loadRoleMenuPermission(id);
      }
    },
    [roleMenuPermissions, selectedRoleMenuPermission, dispatch, loadRoleMenuPermission],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected role menu permission
  const setSelected = useCallback(
    (permission: IRoleMenuPermission | null) => {
      dispatch(setSelectedRoleMenuPermission(permission));
    },
    [dispatch],
  );

  return {
    // State
    roleMenuPermissions,
    selectedRoleMenuPermission,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
    rolesWithPermissionsStatus,
    rolesWithPermissions,

    // Actions
    loadRoleMenuPermissions,
    loadRoleMenuPermission,
    loadRolesWithPermissions,
    createRoleMenuPermission,
    bulkUpdateRoleMenuPermissions,
    editRoleMenuPermission,
    removeRoleMenuPermission,
    getRoleMenuPermissionById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
