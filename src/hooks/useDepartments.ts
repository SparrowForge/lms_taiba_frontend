import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IBasePaginatedResponse, Status} from '@/types/common';
import {IDepartment, IDepartmentCreate, IDepartmentUpdate} from '@/types/department';

import {departmentService} from '@/services/departmentService';

import {
    addDepartment,
    clearActionStatus,
    clearDetailsStatus,
    deleteDepartment,
    setActionStatus,
    setDepartments,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedDepartment,
    updateDepartment,
} from '@/store/slices/departmentSlice';

export const useDepartments = () => {
  const dispatch = useDispatch();
  const { departments, selectedDepartment, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.departments);

  // Load departments with pagination and search
  const loadDepartments = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IDepartment> =
          await departmentService.getDepartments(params);
        console.log(response);
        dispatch(setDepartments(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load departments'
            : 'Failed to load departments';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single department
  const loadDepartment = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IDepartment = await departmentService.getDepartment(id);
        dispatch(setSelectedDepartment(response));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load department'
            : 'Failed to load department';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new department
  const createDepartment = useCallback(
    async (data: IDepartmentCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IDepartment = await departmentService.createDepartment(data);
        dispatch(addDepartment(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Department created successfully' }),
        );
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create department'
            : 'Failed to create department';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing department
  const editDepartment = useCallback(
    async (id: number, data: IDepartmentUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IDepartment = await departmentService.updateDepartment(id, data);
        dispatch(updateDepartment(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Department updated successfully' }),
        );
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update department'
            : 'Failed to update department';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a department
  const removeDepartment = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await departmentService.deleteDepartment(id);
        dispatch(deleteDepartment(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Department deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete department'
            : 'Failed to delete department';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get department by ID from the current list
  const getDepartmentById = useCallback(
    (id: number): IDepartment | undefined => {
      return departments.find((department) => department.id === id);
    },
    [departments],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected department
  const setSelected = useCallback(
    (department: IDepartment | null) => {
      dispatch(setSelectedDepartment(department));
    },
    [dispatch],
  );

  return {
    // State
    departments,
    selectedDepartment,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadDepartments,
    loadDepartment,
    createDepartment,
    editDepartment,
    removeDepartment,
    getDepartmentById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
