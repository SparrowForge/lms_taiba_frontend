import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IExamSchedule, IExamScheduleCreate, IExamScheduleUpdate } from '@/types/examSchedule';

import { examScheduleService } from '@/services/examScheduleService';

import {
  addExamSchedule,
  clearActionStatus,
  clearDetailsStatus,
  deleteExamSchedule,
  setActionStatus,
  setDetailsStatus,
  setExamSchedules,
  setListStatus,
  setPagination,
  setSelectedExamSchedule,
  updateExamSchedule,
} from '@/store/slices/examScheduleSlice';

export const useExamSchedules = () => {
  const dispatch = useDispatch();
  const {
    examSchedules,
    selectedExamSchedule,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.examSchedules);

  const loadExamSchedules = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IExamSchedule> =
          await examScheduleService.getExamSchedules(params);
        dispatch(setExamSchedules(response.data?.items ?? []));
        dispatch(
          setPagination(
            response.data?.meta ?? {
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
            ? error.response?.data?.message || error.message || 'Failed to fetch exam schedules'
            : 'Failed to fetch exam schedules';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadExamSchedule = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IExamSchedule> =
          await examScheduleService.getExamSchedule(id);
        dispatch(setSelectedExamSchedule(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message || 'Failed to fetch exam schedule'
            : 'Failed to fetch exam schedule';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createExamSchedule = useCallback(
    async (data: IExamScheduleCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IExamSchedule> =
          await examScheduleService.createExamSchedule(data);
        dispatch(addExamSchedule(response.data));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response.data;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create exam schedule'
            : 'Failed to create exam schedule';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editExamSchedule = useCallback(
    async (id: number, data: IExamScheduleUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IExamSchedule> = await examScheduleService.updateExamSchedule(
          id,
          data,
        );
        dispatch(updateExamSchedule(response.data));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response.data;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update exam schedule'
            : 'Failed to update exam schedule';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeExamSchedule = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await examScheduleService.deleteExamSchedule(id);
        dispatch(deleteExamSchedule(id));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete exam schedule'
            : 'Failed to delete exam schedule';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getExamScheduleById = useCallback(
    (id: number) => {
      if (selectedExamSchedule && selectedExamSchedule.id === id) {
        return;
      }

      const examSchedule = examSchedules.find((examSchedule) => examSchedule.id === id);
      if (examSchedule) {
        dispatch(setSelectedExamSchedule(examSchedule));
      } else {
        loadExamSchedule(id);
      }
    },
    [examSchedules, selectedExamSchedule, dispatch, loadExamSchedule],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (examSchedule: IExamSchedule | null) => {
      dispatch(setSelectedExamSchedule(examSchedule));
    },
    [dispatch],
  );

  return {
    // State
    examSchedules,
    selectedExamSchedule,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadExamSchedules,
    loadExamSchedule,
    createExamSchedule,
    editExamSchedule,
    removeExamSchedule,
    getExamScheduleById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
