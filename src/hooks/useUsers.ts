'use client';

import { AxiosError } from 'axios';
import { useCallback } from 'react';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBaseResponse } from '@/types/common';
import { IUser, IUserCreate, IUserFilters, IUserUpdate } from '@/types/user';

import { userService } from '@/services/userService';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addUser,
  clearFilters,
  clearUsers,
  deleteUser,
  setActionStatus,
  setDetailsStatus,
  setFilters,
  setListStatus,
  setPagination,
  setSelectedUser,
  setUsers,
  updateUser,
} from '@/store/slices/userSlice';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const { listStatus, detailsStatus, actionStatus, users, selectedUser, pagination, filters } =
    useAppSelector((state: RootState) => state.users);

  // Load users with filters (List action)
  const loadUsers = useCallback(
    async (filters: IUserFilters = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));

        const response = await userService.getUsers(filters);
        console.log(response);
        dispatch(setUsers(response.data.items ?? []));
        dispatch(setPagination(response.data.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message || 'Failed to fetch users'
            : 'Failed to fetch users';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load single user (Details action)
  const loadUser = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));

        const response: IBaseResponse<IUser> = await userService.getUser(id);
        dispatch(setSelectedUser(response.data));

        // Update user in the list if exists, otherwise add
        const index = users.findIndex((user: IUser) => user.id === response.data.id);
        if (index !== -1) {
          dispatch(updateUser(response.data));
        } else {
          dispatch(addUser(response.data));
        }
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message || 'Failed to fetch user'
            : 'Failed to fetch user';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create user (Action)
  const addUserAction = useCallback(
    async (userData: IUserCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));

        const response = await userService.createUser(userData);
        dispatch(addUser(response));
        dispatch(setActionStatus({ status: Status.SUCCESS, message: 'User created successfully' }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message || 'Failed to create user'
            : 'Failed to create user';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Update user (Action)
  const editUser = useCallback(
    async (id: number, userData: IUserUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));

        const response = await userService.updateUser(id, userData);
        dispatch(updateUser(response));
        dispatch(setActionStatus({ status: Status.SUCCESS, message: 'User updated successfully' }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message || 'Failed to update user'
            : 'Failed to update user';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Delete user (Action)
  const removeUser = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));

        await userService.deleteUser(id);
        dispatch(deleteUser(id));
        dispatch(setActionStatus({ status: Status.SUCCESS, message: 'User deleted successfully' }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message || 'Failed to delete user'
            : 'Failed to delete user';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Update user status (Action)
  const changeUserStatus = useCallback(
    async (id: number, status: 'active' | 'inactive' | 'pending') => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));

        const response = await userService.updateUserStatus(id, status);
        dispatch(updateUser(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'User status updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message || 'Failed to update user status'
            : 'Failed to update user status';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Set filters
  const setUserFilters = useCallback(
    (newFilters: IUserFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch],
  );

  // Clear filters
  const clearUserFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Clear users
  const clearUserList = useCallback(() => {
    dispatch(clearUsers());
  }, [dispatch]);

  // Get user by ID
  const getUserById = useCallback(
    (id: number) => {
      if (selectedUser && selectedUser.id === id) {
        return;
      }

      const user = users.find((user: IUser) => user.id === id);
      if (user) {
        dispatch(setSelectedUser(user));
      } else {
        loadUser(id);
      }
    },
    [users, selectedUser, dispatch, loadUser],
  );

  // // Get users by role
  // const getUsersByRole = useCallback((role: 'admin' | 'teacher' | 'student') => {
  //   return users.filter((user: IUser) => user.role === role)
  // }, [users])

  // Get users by status
  const getUsersByStatus = useCallback(
    (status: 'active' | 'inactive' | 'pending') => {
      return users.filter((user: IUser) => user.status === status);
    },
    [users],
  );

  // Search users locally
  const searchUsersLocally = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase();
      return users.filter(
        (user: IUser) =>
          user.name.toLowerCase().includes(lowercaseQuery) ||
          user.phone?.toLowerCase().includes(lowercaseQuery),
      );
    },
    [users],
  );

  // Pagination helpers
  const goToPage = useCallback(
    (page: number) => {
      setUserFilters({ ...filters, page });
    },
    [filters, setUserFilters],
  );

  const changePageSize = useCallback(
    (limit: number) => {
      setUserFilters({ ...filters, limit, page: 1 });
    },
    [filters, setUserFilters],
  );

  return {
    // State
    users,
    selectedUser,
    pagination,
    filters,

    // Status states
    listStatus,
    detailsStatus,
    actionStatus,

    // Actions
    loadUsers,
    loadUser,
    addUser: addUserAction,
    editUser,
    removeUser,
    changeUserStatus,
    setUserFilters,
    clearUserFilters,
    clearUserList,

    // Helpers
    getUserById,
    // getUsersByRole,
    getUsersByStatus,
    searchUsersLocally,

    // Pagination
    goToPage,
    changePageSize,
  };
};
