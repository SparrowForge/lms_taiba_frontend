import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IQuestionSet } from '@/types/questionSet';

// State interface
interface IQuestionSetsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  questionSets: IQuestionSet[];
  selectedQuestionSet: IQuestionSet | null;
  pagination: IPaginationMeta;
}

// Initial state
const initialState: IQuestionSetsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  questionSets: [],
  selectedQuestionSet: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

// Slice
const questionSetSlice = createSlice({
  name: 'questionSets',
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
    setQuestionSets: (state, action: PayloadAction<IQuestionSet[]>) => {
      state.questionSets = action.payload;
    },
    addQuestionSet: (state, action: PayloadAction<IQuestionSet>) => {
      state.questionSets.unshift(action.payload);
    },
    updateQuestionSet: (state, action: PayloadAction<IQuestionSet>) => {
      const index = state.questionSets.findIndex(
        (questionSet) => questionSet.id === action.payload.id,
      );
      if (index !== -1) {
        state.questionSets[index] = action.payload;
      }
      if (state.selectedQuestionSet?.id === action.payload.id) {
        state.selectedQuestionSet = action.payload;
      }
    },
    deleteQuestionSet: (state, action: PayloadAction<number>) => {
      state.questionSets = state.questionSets.filter(
        (questionSet) => questionSet.id !== action.payload,
      );
      if (state.selectedQuestionSet?.id === action.payload) {
        state.selectedQuestionSet = null;
      }
    },
    setSelectedQuestionSet: (state, action: PayloadAction<IQuestionSet | null>) => {
      state.selectedQuestionSet = action.payload;
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
  setQuestionSets,
  addQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
  setSelectedQuestionSet,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = questionSetSlice.actions;

export default questionSetSlice.reducer;

