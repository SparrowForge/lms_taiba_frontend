import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { ISemesterSubject } from '@/types/semesterSubject';

interface SemesterSubjectState {
  semesterSubjects: ISemesterSubject[];
  selectedSemesterSubject: ISemesterSubject | null;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: SemesterSubjectState = {
  semesterSubjects: [],
  selectedSemesterSubject: null,
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

const semesterSubjectSlice = createSlice({
  name: 'semesterSubjects',
  initialState,
  reducers: {
    setSemesterSubjects: (state, action: PayloadAction<ISemesterSubject[]>) => {
      state.semesterSubjects = action.payload;
    },
    setSelectedSemesterSubject: (state, action: PayloadAction<ISemesterSubject | null>) => {
      state.selectedSemesterSubject = action.payload;
    },
    addSemesterSubject: (state, action: PayloadAction<ISemesterSubject>) => {
      state.semesterSubjects.unshift(action.payload);
    },
    updateSemesterSubject: (state, action: PayloadAction<ISemesterSubject>) => {
      const index = state.semesterSubjects.findIndex(
        (semesterSubject) => semesterSubject.id === action.payload.id,
      );
      if (index !== -1) {
        state.semesterSubjects[index] = action.payload;
      }
    },
    deleteSemesterSubject: (state, action: PayloadAction<number>) => {
      state.semesterSubjects = state.semesterSubjects.filter(
        (semesterSubject) => semesterSubject.id !== action.payload,
      );
    },
    setListStatus: (state, action: PayloadAction<IStatusState>) => {
      state.listStatus = action.payload;
    },
    setDetailsStatus: (state, action: PayloadAction<IStatusState>) => {
      state.detailsStatus = action.payload;
    },
    setActionStatus: (state, action: PayloadAction<IStatusState>) => {
      state.actionStatus = action.payload;
    },
    setPagination: (state, action: PayloadAction<SemesterSubjectState['pagination']>) => {
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
  setSemesterSubjects,
  setSelectedSemesterSubject,
  addSemesterSubject,
  updateSemesterSubject,
  deleteSemesterSubject,
  setListStatus,
  setDetailsStatus,
  setActionStatus,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = semesterSubjectSlice.actions;

export default semesterSubjectSlice.reducer;
