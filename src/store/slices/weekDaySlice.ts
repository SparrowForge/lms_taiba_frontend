import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IWeekDay } from '@/types/weekDay';

interface IWeekDaysState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  weekDays: IWeekDay[];
  selectedWeekDay: IWeekDay | null;
  pagination: IPaginationMeta;
}

const initialState: IWeekDaysState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  weekDays: [],
  selectedWeekDay: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const weekDaySlice = createSlice({
  name: 'weekDays',
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
    setWeekDays: (state, action: PayloadAction<IWeekDay[]>) => {
      state.weekDays = action.payload;
    },
    addWeekDay: (state, action: PayloadAction<IWeekDay>) => {
      state.weekDays.unshift(action.payload);
    },
    updateWeekDay: (state, action: PayloadAction<IWeekDay>) => {
      const index = state.weekDays.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.weekDays[index] = action.payload;
      if (state.selectedWeekDay?.id === action.payload.id) state.selectedWeekDay = action.payload;
    },
    deleteWeekDay: (state, action: PayloadAction<number>) => {
      state.weekDays = state.weekDays.filter((item) => item.id !== action.payload);
      if (state.selectedWeekDay?.id === action.payload) state.selectedWeekDay = null;
    },
    setSelectedWeekDay: (state, action: PayloadAction<IWeekDay | null>) => {
      state.selectedWeekDay = action.payload;
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
  setWeekDays,
  addWeekDay,
  updateWeekDay,
  deleteWeekDay,
  setSelectedWeekDay,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = weekDaySlice.actions;

export default weekDaySlice.reducer;
