import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IExamMCQMultipleQuestion, IExamMCQQuestion } from '@/types/examMCQQuestion';

interface IExamMCQQuestionsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  examMCQQuestions: IExamMCQQuestion[];
  examMCQMultipleQuestions:IExamMCQMultipleQuestion[];
  selectedExamMCQQuestion: IExamMCQQuestion | null;
  pagination: IPaginationMeta;
}

const initialState: IExamMCQQuestionsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  examMCQQuestions: [],
  examMCQMultipleQuestions: [],
  selectedExamMCQQuestion: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const examMCQQuestionSlice = createSlice({
  name: 'examMCQQuestions',
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
    setExamMCQQuestions: (state, action: PayloadAction<IExamMCQQuestion[]>) => {
      state.examMCQQuestions = action.payload;
    },
    addExamMCQQuestion: (state, action: PayloadAction<IExamMCQQuestion>) => {
      state.examMCQQuestions.unshift(action.payload);
    },
    addExamMCQMultipleQuestion: (state, action: PayloadAction<IExamMCQMultipleQuestion>) => {
      state.examMCQMultipleQuestions.unshift(action.payload);
    },
    updateExamMCQQuestion: (state, action: PayloadAction<IExamMCQQuestion>) => {
      const index = state.examMCQQuestions.findIndex(
        (examMCQQuestion) => examMCQQuestion.id === action.payload.id,
      );
      if (index !== -1) {
        state.examMCQQuestions[index] = action.payload;
      }
      if (state.selectedExamMCQQuestion?.id === action.payload.id) {
        state.selectedExamMCQQuestion = action.payload;
      }
    },
    deleteExamMCQQuestion: (state, action: PayloadAction<number>) => {
      state.examMCQQuestions = state.examMCQQuestions.filter(
        (examMCQQuestion) => examMCQQuestion.id !== action.payload,
      );
      if (state.selectedExamMCQQuestion?.id === action.payload) {
        state.selectedExamMCQQuestion = null;
      }
    },
    setSelectedExamMCQQuestion: (state, action: PayloadAction<IExamMCQQuestion | null>) => {
      state.selectedExamMCQQuestion = action.payload;
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
  setExamMCQQuestions,
  addExamMCQQuestion,
  addExamMCQMultipleQuestion,
  updateExamMCQQuestion,
  deleteExamMCQQuestion,
  setSelectedExamMCQQuestion,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = examMCQQuestionSlice.actions;

export default examMCQQuestionSlice.reducer;
