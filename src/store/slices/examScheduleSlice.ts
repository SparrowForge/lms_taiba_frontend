import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IExamSchedule } from '@/types/examSchedule';

export interface IExamSchedulesState {
  examSchedules: IExamSchedule[];
  selectedExamSchedule: IExamSchedule | null;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: IExamSchedulesState = {
  examSchedules: [],
  selectedExamSchedule: null,
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const examScheduleSlice = createSlice({
  name: 'examSchedules',
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
    setExamSchedules: (state, action: PayloadAction<IExamSchedule[]>) => {
      state.examSchedules = action.payload;
    },
    addExamSchedule: (state, action: PayloadAction<IExamSchedule>) => {
      state.examSchedules.unshift(action.payload);
    },
    updateExamSchedule: (state, action: PayloadAction<IExamSchedule>) => {
      const index = state.examSchedules.findIndex(
        (examSchedule) => examSchedule.id === action.payload.id,
      );
      if (index !== -1) {
        state.examSchedules[index] = action.payload;
      }
    },
    deleteExamSchedule: (state, action: PayloadAction<number>) => {
      state.examSchedules = state.examSchedules.filter(
        (examSchedule) => examSchedule.id !== action.payload,
      );
    },
    setSelectedExamSchedule: (state, action: PayloadAction<IExamSchedule | null>) => {
      state.selectedExamSchedule = action.payload;
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
  setExamSchedules,
  addExamSchedule,
  updateExamSchedule,
  deleteExamSchedule,
  setSelectedExamSchedule,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = examScheduleSlice.actions;

export default examScheduleSlice.reducer;
