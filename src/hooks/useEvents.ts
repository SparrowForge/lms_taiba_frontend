import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IEvent, IEventCreate, IEventUpdate } from '@/types/event';

import { eventService } from '@/services/eventService';

import {
  addEvent,
  clearActionStatus,
  clearDetailsStatus,
  deleteEvent,
  setActionStatus,
  setDetailsStatus,
  setEvents,
  setListStatus,
  setPagination,
  setSelectedEvent,
  updateEvent,
} from '@/store/slices/eventSlice';

export const useEvents = () => {
  const dispatch = useDispatch();
  const { events, selectedEvent, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.events);

  const loadEvents = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IEvent> = await eventService.getEvents(params);
        dispatch(setEvents(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load events'
            : 'Failed to load events';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadEvent = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IEvent> = await eventService.getEvent(id);
        dispatch(setSelectedEvent(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load event'
            : 'Failed to load event';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createEvent = useCallback(
    async (data: IEventCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IEvent = await eventService.createEvent(data);
        dispatch(addEvent(response));
        dispatch(setActionStatus({ status: Status.SUCCESS, message: 'Event created successfully' }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create event'
            : 'Failed to create event';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editEvent = useCallback(
    async (id: number, data: IEventUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IEvent = await eventService.updateEvent(id, data);
        dispatch(updateEvent(response));
        dispatch(setActionStatus({ status: Status.SUCCESS, message: 'Event updated successfully' }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update event'
            : 'Failed to update event';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeEvent = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await eventService.deleteEvent(id);
        dispatch(deleteEvent(id));
        dispatch(setActionStatus({ status: Status.SUCCESS, message: 'Event deleted successfully' }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete event'
            : 'Failed to delete event';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getEventById = useCallback(
    (id: number) => {
      if (selectedEvent && selectedEvent.id === id) {
        return;
      }

      const ev = events.find((item) => item.id === id);
      if (ev) {
        dispatch(setSelectedEvent(ev));
      } else {
        loadEvent(id);
      }
    },
    [events, selectedEvent, dispatch, loadEvent],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (item: IEvent | null) => {
      dispatch(setSelectedEvent(item));
    },
    [dispatch],
  );

  return {
    events,
    selectedEvent,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadEvents,
    loadEvent,
    createEvent,
    editEvent,
    removeEvent,
    getEventById,
    clearAction,
    clearDetails,
    setSelected,
  };
};

