import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IStudentFamily } from '@/types/studentFamily';

interface StudentFamilyState {
  studentFamilies: IStudentFamily[];
  selectedStudentFamily: IStudentFamily | null;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: StudentFamilyState = {
  studentFamilies: [],
  selectedStudentFamily: null,
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

const studentFamilySlice = createSlice({
  name: 'studentFamilies',
  initialState,
  reducers: {
    setStudentFamilies: (state, action: PayloadAction<IStudentFamily[]>) => {
      state.studentFamilies = action.payload;
    },
    addStudentFamily: (state, action: PayloadAction<IStudentFamily>) => {
      state.studentFamilies.unshift(action.payload);
    },
    updateStudentFamily: (state, action: PayloadAction<IStudentFamily>) => {
      const index = state.studentFamilies.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.studentFamilies[index] = action.payload;
      }
    },
    deleteStudentFamily: (state, action: PayloadAction<number>) => {
      state.studentFamilies = state.studentFamilies.filter((item) => item.id !== action.payload);
    },
    setSelectedStudentFamily: (state, action: PayloadAction<IStudentFamily | null>) => {
      state.selectedStudentFamily = action.payload;
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
  setStudentFamilies,
  addStudentFamily,
  updateStudentFamily,
  deleteStudentFamily,
  setSelectedStudentFamily,
  setListStatus,
  setDetailsStatus,
  setActionStatus,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = studentFamilySlice.actions;

export default studentFamilySlice.reducer;
