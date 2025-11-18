import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IExam } from '@/types/exam';

export interface IExamsState {
  exams: IExam[];
  selectedExam: IExam | null;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: IExamsState = {
  exams: [],
  selectedExam: null,
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

const examSlice = createSlice({
  name: 'exams',
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
    setExams: (state, action: PayloadAction<IExam[]>) => {
      state.exams = action.payload;
    },
    addExam: (state, action: PayloadAction<IExam>) => {
      state.exams.unshift(action.payload);
    },
    updateExam: (state, action: PayloadAction<IExam>) => {
      const index = state.exams.findIndex((exam) => exam.id === action.payload.id);
      if (index !== -1) {
        state.exams[index] = action.payload;
      }
    },
    deleteExam: (state, action: PayloadAction<number>) => {
      state.exams = state.exams.filter((exam) => exam.id !== action.payload);
    },
    setSelectedExam: (state, action: PayloadAction<IExam | null>) => {
      state.selectedExam = action.payload;
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
  setExams,
  addExam,
  updateExam,
  deleteExam,
  setSelectedExam,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = examSlice.actions;

export default examSlice.reducer;
