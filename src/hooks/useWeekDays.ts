import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IWeekDay, IWeekDayCreate, IWeekDayUpdate } from '@/types/weekDay';

import { weekDayService } from '@/services/weekDayService';

import {
  addWeekDay,
  clearActionStatus,
  clearDetailsStatus,
  deleteWeekDay,
  setActionStatus,
  setDetailsStatus,
  setListStatus,
  setPagination,
  setSelectedWeekDay,
  setWeekDays,
  updateWeekDay,
} from '@/store/slices/weekDaySlice';

export const useWeekDays = () => {
  const dispatch = useDispatch();
  const { weekDays, selectedWeekDay, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.weekDays);

  const loadWeekDays = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IWeekDay> = await weekDayService.getWeekDays(params);
        dispatch(setWeekDays(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load week days'
            : 'Failed to load week days';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadWeekDay = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IWeekDay> = await weekDayService.getWeekDay(id);
        dispatch(setSelectedWeekDay(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load week day'
            : 'Failed to load week day';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createWeekDay = useCallback(
    async (data: IWeekDayCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IWeekDay = await weekDayService.createWeekDay(data);
        dispatch(addWeekDay(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Week Day created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create week day'
            : 'Failed to create week day';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editWeekDay = useCallback(
    async (id: number, data: IWeekDayUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IWeekDay = await weekDayService.updateWeekDay(id, data);
        dispatch(updateWeekDay(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Week Day updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update week day'
            : 'Failed to update week day';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeWeekDay = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await weekDayService.deleteWeekDay(id);
        dispatch(deleteWeekDay(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Week Day deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete week day'
            : 'Failed to delete week day';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getWeekDayById = useCallback(
    (id: number) => {
      if (selectedWeekDay && selectedWeekDay.id === id) {
        return;
      }

      const weekDay = weekDays.find((item) => item.id === id);
      if (weekDay) {
        dispatch(setSelectedWeekDay(weekDay));
      } else {
        loadWeekDay(id);
      }
    },
    [weekDays, selectedWeekDay, dispatch, loadWeekDay],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);
  const setSelected = useCallback(
    (item: IWeekDay | null) => {
      dispatch(setSelectedWeekDay(item));
    },
    [dispatch],
  );

  return {
    weekDays,
    selectedWeekDay,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadWeekDays,
    loadWeekDay,
    createWeekDay,
    editWeekDay,
    removeWeekDay,
    getWeekDayById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
