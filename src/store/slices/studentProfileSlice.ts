import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IStudentProfile } from '@/types/studentProfile';

interface StudentProfileState {
  studentProfiles: IStudentProfile[];
  selectedStudentProfile: IStudentProfile | null;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: StudentProfileState = {
  studentProfiles: [],
  selectedStudentProfile: null,
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

const studentProfileSlice = createSlice({
  name: 'studentProfiles',
  initialState,
  reducers: {
    setStudentProfiles: (state, action: PayloadAction<IStudentProfile[]>) => {
      state.studentProfiles = action.payload;
    },
    addStudentProfile: (state, action: PayloadAction<IStudentProfile>) => {
      state.studentProfiles.unshift(action.payload);
    },
    updateStudentProfile: (state, action: PayloadAction<IStudentProfile>) => {
      const index = state.studentProfiles.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.studentProfiles[index] = action.payload;
      }
    },
    deleteStudentProfile: (state, action: PayloadAction<number>) => {
      state.studentProfiles = state.studentProfiles.filter((item) => item.id !== action.payload);
    },
    setSelectedStudentProfile: (state, action: PayloadAction<IStudentProfile | null>) => {
      state.selectedStudentProfile = action.payload;
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
  setStudentProfiles,
  addStudentProfile,
  updateStudentProfile,
  deleteStudentProfile,
  setSelectedStudentProfile,
  setListStatus,
  setDetailsStatus,
  setActionStatus,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = studentProfileSlice.actions;

export default studentProfileSlice.reducer;
