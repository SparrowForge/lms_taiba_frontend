import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Status} from '@/enums';

import {IClassSchedule} from '@/types/classSchedule';
import {IPaginationMeta, IStatusState} from '@/types/common';

interface IClassSchedulesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  classSchedules: IClassSchedule[];
  selectedClassSchedule: IClassSchedule | null;
  pagination: IPaginationMeta;
}

const initialState: IClassSchedulesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  classSchedules: [],
  selectedClassSchedule: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const classScheduleSlice = createSlice({
  name: 'classSchedules',
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
    setClassSchedules: (state, action: PayloadAction<IClassSchedule[]>) => {
      state.classSchedules = action.payload;
    },
    addClassSchedule: (state, action: PayloadAction<IClassSchedule>) => {
      state.classSchedules.unshift(action.payload);
    },
    updateClassSchedule: (state, action: PayloadAction<IClassSchedule>) => {
      const index = state.classSchedules.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.classSchedules[index] = action.payload;
      if (state.selectedClassSchedule?.id === action.payload.id)
        state.selectedClassSchedule = action.payload;
    },
    deleteClassSchedule: (state, action: PayloadAction<number>) => {
      state.classSchedules = state.classSchedules.filter((item) => item.id !== action.payload);
      if (state.selectedClassSchedule?.id === action.payload) state.selectedClassSchedule = null;
    },
    setSelectedClassSchedule: (state, action: PayloadAction<IClassSchedule | null>) => {
      state.selectedClassSchedule = action.payload;
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
  setClassSchedules,
  addClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
  setSelectedClassSchedule,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = classScheduleSlice.actions;

export default classScheduleSlice.reducer;
