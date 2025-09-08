import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IScheduleType, IScheduleTypeCreate, IScheduleTypeUpdate } from '@/types/scheduleType';

import { scheduleTypeService } from '@/services/scheduleTypeService';

import {
  addScheduleType,
  clearActionStatus,
  clearDetailsStatus,
  deleteScheduleType,
  setActionStatus,
  setDetailsStatus,
  setListStatus,
  setPagination,
  setScheduleTypes,
  setSelectedScheduleType,
  updateScheduleType,
} from '@/store/slices/scheduleTypeSlice';

export const useScheduleTypes = () => {
  const dispatch = useDispatch();
  const {
    scheduleTypes,
    selectedScheduleType,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.scheduleTypes);

  const loadScheduleTypes = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IScheduleType> =
          await scheduleTypeService.getScheduleTypes(params);
        dispatch(setScheduleTypes(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load schedule types'
            : 'Failed to load schedule types';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadScheduleType = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IScheduleType> =
          await scheduleTypeService.getScheduleType(id);
        dispatch(setSelectedScheduleType(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load schedule type'
            : 'Failed to load schedule type';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createScheduleType = useCallback(
    async (data: IScheduleTypeCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IScheduleType = await scheduleTypeService.createScheduleType(data);
        dispatch(addScheduleType(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Schedule Type created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create schedule type'
            : 'Failed to create schedule type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editScheduleType = useCallback(
    async (id: number, data: IScheduleTypeUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IScheduleType = await scheduleTypeService.updateScheduleType(id, data);
        dispatch(updateScheduleType(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Schedule Type updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update schedule type'
            : 'Failed to update schedule type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeScheduleType = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await scheduleTypeService.deleteScheduleType(id);
        dispatch(deleteScheduleType(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Schedule Type deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete schedule type'
            : 'Failed to delete schedule type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getScheduleTypeById = useCallback(
    (id: number) => {
      if (selectedScheduleType && selectedScheduleType.id === id) {
        return;
      }

      const scheduleType = scheduleTypes.find((item) => item.id === id);
      if (scheduleType) {
        dispatch(setSelectedScheduleType(scheduleType));
      } else {
        loadScheduleType(id);
      }
    },
    [scheduleTypes, selectedScheduleType, dispatch, loadScheduleType],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);
  const setSelected = useCallback(
    (item: IScheduleType | null) => {
      dispatch(setSelectedScheduleType(item));
    },
    [dispatch],
  );

  return {
    scheduleTypes,
    selectedScheduleType,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadScheduleTypes,
    loadScheduleType,
    createScheduleType,
    editScheduleType,
    removeScheduleType,
    getScheduleTypeById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
