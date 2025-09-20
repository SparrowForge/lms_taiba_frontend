import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IExamType, IExamTypeCreate, IExamTypeUpdate } from '@/types/examType';

import { examTypeService } from '@/services/examTypeService';

import {
  addExamType,
  clearActionStatus,
  clearDetailsStatus,
  deleteExamType,
  setActionStatus,
  setExamTypes,
  setDetailsStatus,
  setListStatus,
  setPagination,
  setSelectedExamType,
  updateExamType,
} from '@/store/slices/examTypeSlice';

export const useExamTypes = () => {
  const dispatch = useDispatch();
  const { examTypes, selectedExamType, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.examTypes);

  const loadExamTypes = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IExamType> =
          await examTypeService.getExamTypes(params);
        dispatch(setExamTypes(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load exam types'
            : 'Failed to load exam types';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadExamType = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IExamType> = await examTypeService.getExamType(id);
        dispatch(setSelectedExamType(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load exam type'
            : 'Failed to load exam type';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createExamType = useCallback(
    async (data: IExamTypeCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IExamType = await examTypeService.createExamType(data);
        dispatch(addExamType(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Exam type created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create exam type'
            : 'Failed to create exam type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editExamType = useCallback(
    async (id: number, data: IExamTypeUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IExamType = await examTypeService.updateExamType(id, data);
        dispatch(updateExamType(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Exam type updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update exam type'
            : 'Failed to update exam type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeExamType = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await examTypeService.deleteExamType(id);
        dispatch(deleteExamType(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Exam type deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete exam type'
            : 'Failed to delete exam type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getExamTypeById = useCallback(
    (id: number) => {
      if (selectedExamType && selectedExamType.id === id) {
        return;
      }

      const examType = examTypes.find((examType) => examType.id === id);
      if (examType) {
        dispatch(setSelectedExamType(examType));
      } else {
        loadExamType(id);
      }
    },
    [examTypes, selectedExamType, dispatch, loadExamType],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (examType: IExamType | null) => {
      dispatch(setSelectedExamType(examType));
    },
    [dispatch],
  );

  return {
    examTypes,
    selectedExamType,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadExamTypes,
    loadExamType,
    createExamType,
    editExamType,
    removeExamType,
    getExamTypeById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
