import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IStudent } from '@/types/student';

interface IStudentsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  students: IStudent[];
  selectedStudent: IStudent | null;
  pagination: IPaginationMeta;
}

const initialState: IStudentsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  students: [],
  selectedStudent: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const studentSlice = createSlice({
  name: 'students',
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
    setStudents: (state, action: PayloadAction<IStudent[]>) => {
      state.students = action.payload;
    },
    addStudent: (state, action: PayloadAction<IStudent>) => {
      state.students.unshift(action.payload);
    },
    updateStudent: (state, action: PayloadAction<IStudent>) => {
      const index = state.students.findIndex((student) => student.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
      if (state.selectedStudent?.id === action.payload.id) {
        state.selectedStudent = action.payload;
      }
    },
    deleteStudent: (state, action: PayloadAction<number>) => {
      state.students = state.students.filter((student) => student.id !== action.payload);
      if (state.selectedStudent?.id === action.payload) {
        state.selectedStudent = null;
      }
    },
    setSelectedStudent: (state, action: PayloadAction<IStudent | null>) => {
      state.selectedStudent = action.payload;
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
  setStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  setSelectedStudent,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = studentSlice.actions;

export default studentSlice.reducer;
