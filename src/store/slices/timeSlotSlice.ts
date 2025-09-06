import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {IPaginationMeta, IStatusState, Status} from '@/types/common';
import {ITimeSlot} from '@/types/timeSlot';

interface ITimeSlotsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  timeSlots: ITimeSlot[];
  selectedTimeSlot: ITimeSlot | null;
  pagination: IPaginationMeta;
}

const initialState: ITimeSlotsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  timeSlots: [],
  selectedTimeSlot: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const timeSlotSlice = createSlice({
  name: 'timeSlots',
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
    setTimeSlots: (state, action: PayloadAction<ITimeSlot[]>) => {
      state.timeSlots = action.payload;
    },
    addTimeSlot: (state, action: PayloadAction<ITimeSlot>) => {
      state.timeSlots.unshift(action.payload);
    },
    updateTimeSlot: (state, action: PayloadAction<ITimeSlot>) => {
      const index = state.timeSlots.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.timeSlots[index] = action.payload;
      if (state.selectedTimeSlot?.id === action.payload.id) state.selectedTimeSlot = action.payload;
    },
    deleteTimeSlot: (state, action: PayloadAction<number>) => {
      state.timeSlots = state.timeSlots.filter((item) => item.id !== action.payload);
      if (state.selectedTimeSlot?.id === action.payload) state.selectedTimeSlot = null;
    },
    setSelectedTimeSlot: (state, action: PayloadAction<ITimeSlot | null>) => {
      state.selectedTimeSlot = action.payload;
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
  setTimeSlots,
  addTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
  setSelectedTimeSlot,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = timeSlotSlice.actions;

export default timeSlotSlice.reducer;
