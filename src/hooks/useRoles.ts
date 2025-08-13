import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse, Status} from '@/types/common';
import {IRole, IRoleCreate, IRoleUpdate} from '@/types/role';

import {roleService} from '@/services/roleService';

import {
    addRole,
    clearActionStatus,
    clearDetailsStatus,
    deleteRole,
    setActionStatus,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setRoles,
    setSelectedRole,
    updateRole,
} from '@/store/slices/roleSlice';

export const useRoles = () => {
  const dispatch = useDispatch();
  const { roles, selectedRole, listStatus, detailsStatus, actionStatus, pagination } = useSelector(
    (state: RootState) => state.roles,
  );

  // Load roles with pagination and search
  const loadRoles = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IRole> = await roleService.getRoles(params);
        console.log(response);
        dispatch(setRoles(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load roles'
            : 'Failed to load roles';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single role
  const loadRole = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IRole> = await roleService.getRole(id);
        dispatch(setSelectedRole(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load role'
            : 'Failed to load role';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new role
  const createRole = useCallback(
    async (data: IRoleCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IRole = await roleService.createRole(data);
        dispatch(addRole(response));
        dispatch(setActionStatus({ status: Status.SUCCESS, message: 'Role created successfully' }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create role'
            : 'Failed to create role';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing role
  const editRole = useCallback(
    async (id: number, data: IRoleUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IRole = await roleService.updateRole(id, data);
        dispatch(updateRole(response));
        dispatch(setActionStatus({ status: Status.SUCCESS, message: 'Role updated successfully' }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update role'
            : 'Failed to update role';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a role
  const removeRole = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await roleService.deleteRole(id);
        dispatch(deleteRole(id));
        dispatch(setActionStatus({ status: Status.SUCCESS, message: 'Role deleted successfully' }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete role'
            : 'Failed to delete role';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get role by ID from the current list
  const getRoleById = useCallback(
    (id: number) => {
      const role = roles.find((role) => role.id === id);
      if (role) {
        dispatch(setSelectedRole(role));
      } else {
        loadRole(id);
      }
    },
    [dispatch],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected role
  const setSelected = useCallback(
    (role: IRole | null) => {
      dispatch(setSelectedRole(role));
    },
    [dispatch],
  );

  return {
    // State
    roles,
    selectedRole,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadRoles,
    loadRole,
    createRole,
    editRole,
    removeRole,
    getRoleById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
