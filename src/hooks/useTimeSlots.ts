import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse, Status} from '@/types/common';
import {ITimeSlot, ITimeSlotCreate, ITimeSlotUpdate} from '@/types/timeSlot';

import {timeSlotService} from '@/services/timeSlotService';

import {
    addTimeSlot,
    clearActionStatus,
    clearDetailsStatus,
    deleteTimeSlot,
    setActionStatus,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedTimeSlot,
    setTimeSlots,
    updateTimeSlot,
} from '@/store/slices/timeSlotSlice';

export const useTimeSlots = () => {
  const dispatch = useDispatch();
  const {
    timeSlots,
    selectedTimeSlot,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.timeSlots);

  const loadTimeSlots = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<ITimeSlot> =
          await timeSlotService.getTimeSlots(params);
        dispatch(setTimeSlots(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load time slots'
            : 'Failed to load time slots';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadTimeSlot = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<ITimeSlot> = await timeSlotService.getTimeSlot(id);
        dispatch(setSelectedTimeSlot(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load time slot'
            : 'Failed to load time slot';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createTimeSlot = useCallback(
    async (data: ITimeSlotCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ITimeSlot = await timeSlotService.createTimeSlot(data);
        dispatch(addTimeSlot(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Time Slot created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create time slot'
            : 'Failed to create time slot';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editTimeSlot = useCallback(
    async (id: number, data: ITimeSlotUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ITimeSlot = await timeSlotService.updateTimeSlot(id, data);
        dispatch(updateTimeSlot(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Time Slot updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update time slot'
            : 'Failed to update time slot';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeTimeSlot = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await timeSlotService.deleteTimeSlot(id);
        dispatch(deleteTimeSlot(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Time Slot deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete time slot'
            : 'Failed to delete time slot';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getTimeSlotById = useCallback(
    (id: number) => {
      if (selectedTimeSlot && selectedTimeSlot.id === id) {
        return;
      }

      const timeSlot = timeSlots.find((item) => item.id === id);
      if (timeSlot) {
        dispatch(setSelectedTimeSlot(timeSlot));
      } else {
        loadTimeSlot(id);
      }
    },
    [timeSlots, selectedTimeSlot, dispatch, loadTimeSlot],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);
  const setSelected = useCallback(
    (item: ITimeSlot | null) => {
      dispatch(setSelectedTimeSlot(item));
    },
    [dispatch],
  );

  return {
    timeSlots,
    selectedTimeSlot,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadTimeSlots,
    loadTimeSlot,
    createTimeSlot,
    editTimeSlot,
    removeTimeSlot,
    getTimeSlotById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
