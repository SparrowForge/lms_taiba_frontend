import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IExamSubmission } from '@/types/examSubmission';

interface ExamSubmissionState {
  examSubmissions: IExamSubmission[];
  selectedExamSubmission: IExamSubmission | null;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: ExamSubmissionState = {
  examSubmissions: [],
  selectedExamSubmission: null,
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

const examSubmissionSlice = createSlice({
  name: 'examSubmissions',
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
    setExamSubmissions: (state, action: PayloadAction<IExamSubmission[]>) => {
      state.examSubmissions = action.payload;
    },
    addExamSubmission: (state, action: PayloadAction<IExamSubmission>) => {
      state.examSubmissions.unshift(action.payload);
    },
    updateExamSubmission: (state, action: PayloadAction<IExamSubmission>) => {
      const index = state.examSubmissions.findIndex((es) => es.id === action.payload.id);
      if (index !== -1) {
        state.examSubmissions[index] = action.payload;
      }
      if (state.selectedExamSubmission?.id === action.payload.id) {
        state.selectedExamSubmission = action.payload;
      }
    },
    deleteExamSubmission: (state, action: PayloadAction<number>) => {
      state.examSubmissions = state.examSubmissions.filter((es) => es.id !== action.payload);
      if (state.selectedExamSubmission?.id === action.payload) {
        state.selectedExamSubmission = null;
      }
    },
    setSelectedExamSubmission: (state, action: PayloadAction<IExamSubmission | null>) => {
      state.selectedExamSubmission = action.payload;
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
  setExamSubmissions,
  addExamSubmission,
  updateExamSubmission,
  deleteExamSubmission,
  setSelectedExamSubmission,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = examSubmissionSlice.actions;

export default examSubmissionSlice.reducer;
