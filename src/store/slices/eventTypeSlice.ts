import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IEventType } from '@/types/eventType';

interface IEventTypesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  eventTypes: IEventType[];
  selectedEventType: IEventType | null;
  pagination: IPaginationMeta;
}

const initialState: IEventTypesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  eventTypes: [],
  selectedEventType: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const eventTypeSlice = createSlice({
  name: 'eventTypes',
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
    setEventTypes: (state, action: PayloadAction<IEventType[]>) => {
      state.eventTypes = action.payload;
    },
    addEventType: (state, action: PayloadAction<IEventType>) => {
      state.eventTypes.unshift(action.payload);
    },
    updateEventType: (state, action: PayloadAction<IEventType>) => {
      const index = state.eventTypes.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.eventTypes[index] = action.payload;
      }
      if (state.selectedEventType?.id === action.payload.id) {
        state.selectedEventType = action.payload;
      }
    },
    deleteEventType: (state, action: PayloadAction<number>) => {
      state.eventTypes = state.eventTypes.filter((item) => item.id !== action.payload);
      if (state.selectedEventType?.id === action.payload) {
        state.selectedEventType = null;
      }
    },
    setSelectedEventType: (state, action: PayloadAction<IEventType | null>) => {
      state.selectedEventType = action.payload;
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
  setEventTypes,
  addEventType,
  updateEventType,
  deleteEventType,
  setSelectedEventType,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = eventTypeSlice.actions;

export default eventTypeSlice.reducer;

