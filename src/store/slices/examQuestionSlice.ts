import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IExamQuestion, IExamQuestionMultiple } from '@/types/examQuestion';

interface IExamQuestionsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  examQuestions: IExamQuestion[];
  examQuestionMultiples: IExamQuestionMultiple[];
  selectedExamQuestion: IExamQuestion | null;
  pagination: IPaginationMeta;
}

const initialState: IExamQuestionsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  examQuestions: [],
  examQuestionMultiples: [],
  selectedExamQuestion: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const examQuestionSlice = createSlice({
  name: 'examQuestions',
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
    setExamQuestions: (state, action: PayloadAction<IExamQuestion[]>) => {
      state.examQuestions = action.payload;
    },
    addExamQuestion: (state, action: PayloadAction<IExamQuestion>) => {
      state.examQuestions.unshift(action.payload);
    },
    addExamQuestionMultiple: (state, action: PayloadAction<IExamQuestionMultiple>) => {
      state.examQuestionMultiples.unshift(action.payload);
    },
    updateExamQuestion: (state, action: PayloadAction<IExamQuestion>) => {
      const index = state.examQuestions.findIndex(
        (q) => q.id === action.payload.id,
      );
      if (index !== -1) {
        state.examQuestions[index] = action.payload;
      }
      if (state.selectedExamQuestion?.id === action.payload.id) {
        state.selectedExamQuestion = action.payload;
      }
    },
    deleteExamQuestion: (state, action: PayloadAction<number>) => {
      state.examQuestions = state.examQuestions.filter(
        (q) => q.id !== action.payload,
      );
      if (state.selectedExamQuestion?.id === action.payload) {
        state.selectedExamQuestion = null;
      }
    },
    setSelectedExamQuestion: (state, action: PayloadAction<IExamQuestion | null>) => {
      state.selectedExamQuestion = action.payload;
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
  setExamQuestions,
  addExamQuestion,
  addExamQuestionMultiple,
  updateExamQuestion,
  deleteExamQuestion,
  setSelectedExamQuestion,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = examQuestionSlice.actions;

export default examQuestionSlice.reducer;
