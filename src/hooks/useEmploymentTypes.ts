import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse, Status} from '@/types/common';
import {IEmploymentType, IEmploymentTypeCreate, IEmploymentTypeUpdate,} from '@/types/employmentType';

import {employmentTypeService} from '@/services/employmentTypeService';

import {
    addEmploymentType,
    clearActionStatus,
    clearDetailsStatus,
    deleteEmploymentType,
    setActionStatus,
    setDetailsStatus,
    setEmploymentTypes,
    setListStatus,
    setPagination,
    setSelectedEmploymentType,
    updateEmploymentType,
} from '@/store/slices/employmentTypeSlice';


export const useEmploymentTypes = () => {
  const dispatch = useDispatch();
  const {
    employmentTypes,
    selectedEmploymentType,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.employmentTypes);

  const loadEmploymentTypes = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IEmploymentType> =
          await employmentTypeService.getEmploymentTypes(params);
        dispatch(setEmploymentTypes(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load employment types'
            : 'Failed to load employment types';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadEmploymentType = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IEmploymentType> = await employmentTypeService.getEmploymentType(id);
        dispatch(setSelectedEmploymentType(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load employment type'
            : 'Failed to load employment type';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createEmploymentType = useCallback(
    async (data: IEmploymentTypeCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IEmploymentType = await employmentTypeService.createEmploymentType(data);
        dispatch(addEmploymentType(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Employment Type created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create employment type'
            : 'Failed to create employment type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editEmploymentType = useCallback(
    async (id: number, data: IEmploymentTypeUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IEmploymentType = await employmentTypeService.updateEmploymentType(
          id,
          data,
        );
        dispatch(updateEmploymentType(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Employment Type updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update employment type'
            : 'Failed to update employment type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeEmploymentType = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await employmentTypeService.deleteEmploymentType(id);
        dispatch(deleteEmploymentType(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Employment Type deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete employment type'
            : 'Failed to delete employment type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getEmploymentTypeById = useCallback(
    (id: number) => {
      if (selectedEmploymentType && selectedEmploymentType.id === id) {
        return;
      }

      const employmentType = employmentTypes.find((item) => item.id === id);
      if (employmentType) {
        dispatch(setSelectedEmploymentType(employmentType));
      } else {
        loadEmploymentType(id);
      }
    },
    [employmentTypes, selectedEmploymentType, dispatch, loadEmploymentType],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);
  const setSelected = useCallback(
    (item: IEmploymentType | null) => {
      dispatch(setSelectedEmploymentType(item));
    },
    [dispatch],
  );

  return {
    employmentTypes,
    selectedEmploymentType,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadEmploymentTypes,
    loadEmploymentType,
    createEmploymentType,
    editEmploymentType,
    removeEmploymentType,
    getEmploymentTypeById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
