import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IEventType, IEventTypeCreate, IEventTypeUpdate } from '@/types/eventType';

import { eventTypeService } from '@/services/eventTypeService';

import {
  addEventType,
  clearActionStatus,
  clearDetailsStatus,
  deleteEventType,
  setActionStatus,
  setDetailsStatus,
  setEventTypes,
  setListStatus,
  setPagination,
  setSelectedEventType,
  updateEventType,
} from '@/store/slices/eventTypeSlice';

export const useEventTypes = () => {
  const dispatch = useDispatch();
  const { eventTypes, selectedEventType, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.eventTypes);

  const loadEventTypes = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IEventType> =
          await eventTypeService.getEventTypes(params);
        dispatch(setEventTypes(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load event types'
            : 'Failed to load event types';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadEventType = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IEventType> = await eventTypeService.getEventType(id);
        dispatch(setSelectedEventType(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load event type'
            : 'Failed to load event type';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createEventType = useCallback(
    async (data: IEventTypeCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IEventType = await eventTypeService.createEventType(data);
        dispatch(addEventType(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Event type created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create event type'
            : 'Failed to create event type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editEventType = useCallback(
    async (id: number, data: IEventTypeUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IEventType = await eventTypeService.updateEventType(id, data);
        dispatch(updateEventType(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Event type updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update event type'
            : 'Failed to update event type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeEventType = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await eventTypeService.deleteEventType(id);
        dispatch(deleteEventType(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Event type deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete event type'
            : 'Failed to delete event type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getEventTypeById = useCallback(
    (id: number) => {
      if (selectedEventType && selectedEventType.id === id) {
        return;
      }

      const eventType = eventTypes.find((item) => item.id === id);
      if (eventType) {
        dispatch(setSelectedEventType(eventType));
      } else {
        loadEventType(id);
      }
    },
    [eventTypes, selectedEventType, dispatch, loadEventType],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (item: IEventType | null) => {
      dispatch(setSelectedEventType(item));
    },
    [dispatch],
  );

  return {
    eventTypes,
    selectedEventType,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadEventTypes,
    loadEventType,
    createEventType,
    editEventType,
    removeEventType,
    getEventTypeById,
    clearAction,
    clearDetails,
    setSelected,
  };
};

