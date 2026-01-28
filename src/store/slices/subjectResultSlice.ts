import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { ISubjectExamResult } from '@/types/subjectResult';

interface ISubjectResultsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  subjectResults: ISubjectExamResult[];
  selectedSubjectResult: ISubjectExamResult | null;
  pagination: IPaginationMeta;
}

const initialState: ISubjectResultsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  subjectResults: [],
  selectedSubjectResult: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const subjectResultSlice = createSlice({
  name: 'subjectResults',
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
    setSubjectResults: (state, action: PayloadAction<ISubjectExamResult[]>) => {
      state.subjectResults = action.payload;
    },
    setSelectedSubjectResult: (
      state,
      action: PayloadAction<ISubjectExamResult | null>,
    ) => {
      state.selectedSubjectResult = action.payload;
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
  setSubjectResults,
  setSelectedSubjectResult,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = subjectResultSlice.actions;

export default subjectResultSlice.reducer;
