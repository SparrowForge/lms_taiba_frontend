import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IClassSchedule, IClassScheduleCreate, IClassScheduleUpdate } from '@/types/classSchedule';
import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';

import { classScheduleService } from '@/services/classScheduleService';

import {
  addClassSchedule,
  clearActionStatus,
  clearDetailsStatus,
  deleteClassSchedule,
  setActionStatus,
  setClassSchedules,
  setDetailsStatus,
  setListStatus,
  setPagination,
  setSelectedClassSchedule,
  updateClassSchedule,
} from '@/store/slices/classScheduleSlice';

export const useClassSchedules = () => {
  const dispatch = useDispatch();
  const {
    classSchedules,
    selectedClassSchedule,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.classSchedules);

  const loadClassSchedules = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IClassSchedule> =
          await classScheduleService.getClassSchedules(params);
        dispatch(setClassSchedules(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load class schedules'
            : 'Failed to load class schedules';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadClassSchedule = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IClassSchedule> =
          await classScheduleService.getClassSchedule(id);
        dispatch(setSelectedClassSchedule(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load class schedule'
            : 'Failed to load class schedule';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createClassSchedule = useCallback(
    async (data: IClassScheduleCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IClassSchedule = await classScheduleService.createClassSchedule(data);
        dispatch(addClassSchedule(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Class Schedule created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create class schedule'
            : 'Failed to create class schedule';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editClassSchedule = useCallback(
    async (id: number, data: IClassScheduleUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IClassSchedule = await classScheduleService.updateClassSchedule(id, data);
        dispatch(updateClassSchedule(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Class Schedule updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update class schedule'
            : 'Failed to update class schedule';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeClassSchedule = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await classScheduleService.deleteClassSchedule(id);
        dispatch(deleteClassSchedule(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Class Schedule deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete class schedule'
            : 'Failed to delete class schedule';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getClassScheduleById = useCallback(
    (id: number) => {
      if (selectedClassSchedule && selectedClassSchedule.id === id) {
        return;
      }

      const classSchedule = classSchedules.find((item) => item.id === id);
      if (classSchedule) {
        dispatch(setSelectedClassSchedule(classSchedule));
      } else {
        loadClassSchedule(id);
      }
    },
    [classSchedules, selectedClassSchedule, dispatch, loadClassSchedule],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);
  const setSelected = useCallback(
    (item: IClassSchedule | null) => {
      dispatch(setSelectedClassSchedule(item));
    },
    [dispatch],
  );

  return {
    classSchedules,
    selectedClassSchedule,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadClassSchedules,
    loadClassSchedule,
    createClassSchedule,
    editClassSchedule,
    removeClassSchedule,
    getClassScheduleById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
