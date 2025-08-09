import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {IPaginationMeta, IStatusState, Status} from '@/types/common';
import {IFacultySubject} from '@/types/facultySubject';

interface FacultySubjectState {
  facultySubjects: IFacultySubject[];
  selectedFacultySubject: IFacultySubject | null;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: FacultySubjectState = {
  facultySubjects: [],
  selectedFacultySubject: null,
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

const facultySubjectSlice = createSlice({
  name: 'facultySubjects',
  initialState,
  reducers: {
    setFacultySubjects: (state, action: PayloadAction<IFacultySubject[]>) => {
      state.facultySubjects = action.payload;
    },
    setSelectedFacultySubject: (state, action: PayloadAction<IFacultySubject | null>) => {
      state.selectedFacultySubject = action.payload;
    },
    addFacultySubject: (state, action: PayloadAction<IFacultySubject>) => {
      state.facultySubjects.unshift(action.payload);
    },
    updateFacultySubject: (state, action: PayloadAction<IFacultySubject>) => {
      const index = state.facultySubjects.findIndex(
        (facultySubject) => facultySubject.id === action.payload.id,
      );
      if (index !== -1) {
        state.facultySubjects[index] = action.payload;
      }
    },
    deleteFacultySubject: (state, action: PayloadAction<number>) => {
      state.facultySubjects = state.facultySubjects.filter(
        (facultySubject) => facultySubject.id !== action.payload,
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
  setFacultySubjects,
  setSelectedFacultySubject,
  addFacultySubject,
  updateFacultySubject,
  deleteFacultySubject,
  setListStatus,
  setDetailsStatus,
  setActionStatus,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = facultySubjectSlice.actions;

export default facultySubjectSlice.reducer;
