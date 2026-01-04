import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IMCQQuestion } from '@/types/mcqQuestion';

// State interface
interface IMCQQuestionsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  mcqQuestions: IMCQQuestion[];
  selectedMcqQuestion: IMCQQuestion | null;
  pagination: IPaginationMeta;
}

// Initial state
const initialState: IMCQQuestionsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  mcqQuestions: [],
  selectedMcqQuestion: null,
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
const mcqQuestionSlice = createSlice({
  name: 'mcqQuestions',
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
    setMcqQuestions: (state, action: PayloadAction<IMCQQuestion[]>) => {
      state.mcqQuestions = action.payload;
    },
    addMcqQuestion: (state, action: PayloadAction<IMCQQuestion>) => {
      state.mcqQuestions.unshift(action.payload);
    },
    addBulkMcqQuestions: (state, action: PayloadAction<IMCQQuestion[]>) => {
      state.mcqQuestions.unshift(...action.payload);
    },
    updateMcqQuestion: (state, action: PayloadAction<IMCQQuestion>) => {
      const index = state.mcqQuestions.findIndex(
        (mcqQuestion) => mcqQuestion.id === action.payload.id,
      );
      if (index !== -1) {
        state.mcqQuestions[index] = action.payload;
      }
      if (state.selectedMcqQuestion?.id === action.payload.id) {
        state.selectedMcqQuestion = action.payload;
      }
    },
    deleteMcqQuestion: (state, action: PayloadAction<number>) => {
      state.mcqQuestions = state.mcqQuestions.filter(
        (mcqQuestion) => mcqQuestion.id !== action.payload,
      );
      if (state.selectedMcqQuestion?.id === action.payload) {
        state.selectedMcqQuestion = null;
      }
    },
    setSelectedMcqQuestion: (state, action: PayloadAction<IMCQQuestion | null>) => {
      state.selectedMcqQuestion = action.payload;
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
  setMcqQuestions,
  addMcqQuestion,
  addBulkMcqQuestions,
  updateMcqQuestion,
  deleteMcqQuestion,
  setSelectedMcqQuestion,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = mcqQuestionSlice.actions;

export default mcqQuestionSlice.reducer;

