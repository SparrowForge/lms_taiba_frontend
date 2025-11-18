import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IExamCandidate } from '@/types/examCandidate';

interface IExamCandidatesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  examCandidates: IExamCandidate[];
  selectedExamCandidate: IExamCandidate | null;
  pagination: IPaginationMeta;
}

const initialState: IExamCandidatesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  examCandidates: [],
  selectedExamCandidate: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const examCandidateSlice = createSlice({
  name: 'examCandidates',
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
    setExamCandidates: (state, action: PayloadAction<IExamCandidate[]>) => {
      state.examCandidates = action.payload;
    },
    addExamCandidate: (state, action: PayloadAction<IExamCandidate>) => {
      state.examCandidates.unshift(action.payload);
    },
    updateExamCandidate: (state, action: PayloadAction<IExamCandidate>) => {
      const index = state.examCandidates.findIndex(
        (examCandidate) => examCandidate.id === action.payload.id,
      );
      if (index !== -1) {
        state.examCandidates[index] = action.payload;
      }
      if (state.selectedExamCandidate?.id === action.payload.id) {
        state.selectedExamCandidate = action.payload;
      }
    },
    deleteExamCandidate: (state, action: PayloadAction<number>) => {
      state.examCandidates = state.examCandidates.filter(
        (examCandidate) => examCandidate.id !== action.payload,
      );
      if (state.selectedExamCandidate?.id === action.payload) {
        state.selectedExamCandidate = null;
      }
    },
    setSelectedExamCandidate: (state, action: PayloadAction<IExamCandidate | null>) => {
      state.selectedExamCandidate = action.payload;
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
  setExamCandidates,
  addExamCandidate,
  updateExamCandidate,
  deleteExamCandidate,
  setSelectedExamCandidate,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = examCandidateSlice.actions;

export default examCandidateSlice.reducer;
