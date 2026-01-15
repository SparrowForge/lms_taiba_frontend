import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { ISubjectDiscussion } from '@/types/subjectDiscussion';

interface SubjectDiscussionState {
  subjectDiscussions: ISubjectDiscussion[];
  selectedSubjectDiscussion: ISubjectDiscussion | null;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: SubjectDiscussionState = {
  subjectDiscussions: [],
  selectedSubjectDiscussion: null,
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

const subjectDiscussionSlice = createSlice({
  name: 'subjectDiscussions',
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
    setSubjectDiscussions: (state, action: PayloadAction<ISubjectDiscussion[]>) => {
      state.subjectDiscussions = action.payload;
    },
    addSubjectDiscussion: (state, action: PayloadAction<ISubjectDiscussion>) => {
      state.subjectDiscussions.unshift(action.payload);
    },
    updateSubjectDiscussion: (state, action: PayloadAction<ISubjectDiscussion>) => {
      const index = state.subjectDiscussions.findIndex((sd) => sd.id === action.payload.id);
      if (index !== -1) {
        state.subjectDiscussions[index] = action.payload;
      }
    },
    deleteSubjectDiscussion: (state, action: PayloadAction<number>) => {
      state.subjectDiscussions = state.subjectDiscussions.filter((sd) => sd.id !== action.payload);
    },
    setSelectedSubjectDiscussion: (
      state,
      action: PayloadAction<ISubjectDiscussion | null>,
    ) => {
      state.selectedSubjectDiscussion = action.payload;
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
  setSubjectDiscussions,
  addSubjectDiscussion,
  updateSubjectDiscussion,
  deleteSubjectDiscussion,
  setSelectedSubjectDiscussion,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = subjectDiscussionSlice.actions;

export default subjectDiscussionSlice.reducer;
