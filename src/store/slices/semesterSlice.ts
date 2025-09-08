import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { ISemester, ISemesterWithSubjectsAndFaculty } from '@/types/semester';

interface ISemestersState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  semesters: ISemester[];
  selectedSemester: ISemester | null;
  semesterWithSubjectsAndFaculty: ISemesterWithSubjectsAndFaculty | null;
  pagination: IPaginationMeta;
}

const initialState: ISemestersState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  semesters: [],
  selectedSemester: null,
  semesterWithSubjectsAndFaculty: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const semesterSlice = createSlice({
  name: 'semesters',
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
    setSemesters: (state, action: PayloadAction<ISemester[]>) => {
      state.semesters = action.payload;
    },
    addSemester: (state, action: PayloadAction<ISemester>) => {
      state.semesters.unshift(action.payload);
    },
    updateSemester: (state, action: PayloadAction<ISemester>) => {
      const index = state.semesters.findIndex((semester) => semester.id === action.payload.id);
      if (index !== -1) {
        state.semesters[index] = action.payload;
      }
      if (state.selectedSemester?.id === action.payload.id) {
        state.selectedSemester = action.payload;
      }
    },
    deleteSemester: (state, action: PayloadAction<number>) => {
      state.semesters = state.semesters.filter((semester) => semester.id !== action.payload);
      if (state.selectedSemester?.id === action.payload) {
        state.selectedSemester = null;
      }
    },
    setSelectedSemester: (state, action: PayloadAction<ISemester | null>) => {
      state.selectedSemester = action.payload;
    },
    setSemesterWithSubjectsAndFaculty: (
      state,
      action: PayloadAction<ISemesterWithSubjectsAndFaculty>,
    ) => {
      state.semesterWithSubjectsAndFaculty = action.payload;
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
  setSemesters,
  addSemester,
  updateSemester,
  deleteSemester,
  setSelectedSemester,
  setSemesterWithSubjectsAndFaculty,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = semesterSlice.actions;

export default semesterSlice.reducer;
