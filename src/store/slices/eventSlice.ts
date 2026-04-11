import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IEvent } from '@/types/event';

interface IEventsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  events: IEvent[];
  selectedEvent: IEvent | null;
  pagination: IPaginationMeta;
}

const initialState: IEventsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  events: [],
  selectedEvent: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setListStatus: (state, action: PayloadAction<IStatusState>) => {
      state.listStatus = action.payload;
    },
    setDetailsStatus: (state, action: PayloadAction<IStatusState>) => {
      state.detailsStatus = action.payload;
    },
    setActionStatus: (state, action: PayloadAction<IStatusState>) => {
      state.actionStatus = action.payload;
    },
    setEvents: (state, action: PayloadAction<IEvent[]>) => {
      state.events = action.payload;
    },
    addEvent: (state, action: PayloadAction<IEvent>) => {
      state.events.unshift(action.payload);
    },
    updateEvent: (state, action: PayloadAction<IEvent>) => {
      const index = state.events.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
      if (state.selectedEvent?.id === action.payload.id) {
        state.selectedEvent = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<number>) => {
      state.events = state.events.filter((item) => item.id !== action.payload);
      if (state.selectedEvent?.id === action.payload) {
        state.selectedEvent = null;
      }
    },
    setSelectedEvent: (state, action: PayloadAction<IEvent | null>) => {
      state.selectedEvent = action.payload;
    },
    setPagination: (state, action: PayloadAction<IPaginationMeta>) => {
      state.pagination = action.payload;
    },
    clearActionStatus: (state) => {
      state.actionStatus = { status: Status.INITIAL };
    },
    clearDetailsStatus: (state) => {
      state.detailsStatus = { status: Status.INITIAL };
    },
  },
});

export const {
  setListStatus,
  setDetailsStatus,
  setActionStatus,
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  setSelectedEvent,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = eventSlice.actions;

export default eventSlice.reducer;

