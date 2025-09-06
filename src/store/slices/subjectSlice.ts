import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Status} from '@/enums';

import {IPaginationMeta, IStatusState} from '@/types/common';
import {ISubject} from '@/types/subject';

// State interface
interface ISubjectsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  subjects: ISubject[];
  selectedSubject: ISubject | null;
  pagination: IPaginationMeta;
}

// Initial state
const initialState: ISubjectsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  subjects: [],
  selectedSubject: null,
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
const subjectSlice = createSlice({
  name: 'subjects',
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
    setSubjects: (state, action: PayloadAction<ISubject[]>) => {
      state.subjects = action.payload;
    },
    addSubject: (state, action: PayloadAction<ISubject>) => {
      state.subjects.unshift(action.payload);
    },
    updateSubject: (state, action: PayloadAction<ISubject>) => {
      const index = state.subjects.findIndex((subject) => subject.id === action.payload.id);
      if (index !== -1) {
        state.subjects[index] = action.payload;
      }
      if (state.selectedSubject?.id === action.payload.id) {
        state.selectedSubject = action.payload;
      }
    },
    deleteSubject: (state, action: PayloadAction<number>) => {
      state.subjects = state.subjects.filter((subject) => subject.id !== action.payload);
      if (state.selectedSubject?.id === action.payload) {
        state.selectedSubject = null;
      }
    },
    setSelectedSubject: (state, action: PayloadAction<ISubject | null>) => {
      state.selectedSubject = action.payload;
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
  setSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  setSelectedSubject,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = subjectSlice.actions;

export default subjectSlice.reducer;
