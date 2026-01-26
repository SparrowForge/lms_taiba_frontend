import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IExamResult, ISemesterResult, ISubjectResult } from '@/types/examResult';

interface IExamResultsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  examResults: IExamResult[];
  semesterResults: ISemesterResult[];
  subjectResults: ISubjectResult[];
  selectedExamResult: IExamResult | null;
  pagination: IPaginationMeta;
}

const initialState: IExamResultsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  examResults: [],
  semesterResults: [],
  subjectResults: [],
  selectedExamResult: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const examResultSlice = createSlice({
  name: 'examResults',
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
    setExamResults: (state, action: PayloadAction<IExamResult[]>) => {
      state.examResults = action.payload;
    },
    setSemesterResults: (state, action: PayloadAction<ISemesterResult[]>) => {
      state.semesterResults = action.payload;
    },
    setSubjectResults: (state, action: PayloadAction<ISubjectResult[]>) => {
      state.subjectResults = action.payload;
    },
    addExamResult: (state, action: PayloadAction<IExamResult>) => {
      state.examResults.unshift(action.payload);
    },
    updateExamResult: (state, action: PayloadAction<IExamResult>) => {
      const index = state.examResults.findIndex(
        (examResult) => examResult.id === action.payload.id,
      );
      if (index !== -1) {
        state.examResults[index] = action.payload;
      }
      if (state.selectedExamResult?.id === action.payload.id) {
        state.selectedExamResult = action.payload;
      }
    },
    deleteExamResult: (state, action: PayloadAction<number>) => {
      state.examResults = state.examResults.filter(
        (examResult) => examResult.id !== action.payload,
      );
      if (state.selectedExamResult?.id === action.payload) {
        state.selectedExamResult = null;
      }
    },
    setSelectedExamResult: (state, action: PayloadAction<IExamResult | null>) => {
      state.selectedExamResult = action.payload;
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
  setExamResults,
  setSemesterResults,
  setSubjectResults,
  addExamResult,
  updateExamResult,
  deleteExamResult,
  setSelectedExamResult,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = examResultSlice.actions;

export default examResultSlice.reducer;
