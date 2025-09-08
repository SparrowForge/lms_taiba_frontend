import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IUserRole,
  IUserRoleBulkCreate,
  IUserRoleBulkCreateResponse,
  IUserRoleCreate,
  IUserRoleUpdate,
} from '@/types/userRole';

import { userRoleService } from '@/services/userRoleService';

import {
  addUserRole,
  clearActionStatus,
  clearDetailsStatus,
  deleteUserRole,
  setActionStatus,
  setDetailsStatus,
  setListStatus,
  setPagination,
  setSelectedUserRole,
  setUserRoles,
  updateUserRole,
} from '@/store/slices/userRoleSlice';

export const useUserRoles = () => {
  const dispatch = useDispatch();
  const { userRoles, selectedUserRole, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.userRoles);

  // Load user roles with pagination and search
  const loadUserRoles = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IUserRole> =
          await userRoleService.getUserRoles(params);
        dispatch(setUserRoles(response?.data?.items ?? []));
        dispatch(
          setPagination(
            response?.data?.meta ?? {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          ),
        );
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load user roles'
            : 'Failed to load user roles';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single user role
  const loadUserRole = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IUserRole> = await userRoleService.getUserRole(id);
        dispatch(setSelectedUserRole(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load user role'
            : 'Failed to load user role';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new user role
  const createUserRole = useCallback(
    async (data: IUserRoleCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const newUserRole = await userRoleService.createUserRole(data);
        dispatch(addUserRole(newUserRole));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create user role'
            : 'Failed to create user role';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Create multiple user roles for a single user
  const createUserRolesBulk = useCallback(
    async (data: IUserRoleBulkCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IUserRoleBulkCreateResponse> =
          await userRoleService.createUserRolesBulk(data);
        dispatch(setUserRoles(response.data.newAssignments));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create user roles'
            : 'Failed to create user roles';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // edit an existing user role
  const editUserRole = useCallback(
    async (id: number, data: IUserRoleUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IUserRole = await userRoleService.updateUserRole(id, data);
        dispatch(updateUserRole(response));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update user role'
            : 'Failed to update user role';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Delete a user role
  const removeUserRole = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await userRoleService.deleteUserRole(id);
        dispatch(deleteUserRole(id));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete user role'
            : 'Failed to delete user role';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get user role by ID from the current list
  const getUserRoleById = useCallback(
    (id: number) => {
      if (selectedUserRole && selectedUserRole.id === id) {
        return;
      }

      const userRole = userRoles.find((userRole) => userRole.id === id);
      if (userRole) {
        dispatch(setSelectedUserRole(userRole));
      } else {
        loadUserRole(id);
      }
    },
    [userRoles, selectedUserRole, dispatch, loadUserRole],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  return {
    // State
    userRoles,
    selectedUserRole,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadUserRoles,
    loadUserRole,
    createUserRole,
    createUserRolesBulk,
    editUserRole,
    removeUserRole,
    getUserRoleById,
    clearAction,
    clearDetails,
  };
};
