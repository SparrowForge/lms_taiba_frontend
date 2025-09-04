import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {IPaginationMeta, IStatusState, Status} from '@/types/common';
import {IStudentEducation} from '@/types/studentEducation';

interface StudentEducationState {
  studentEducations: IStudentEducation[];
  selectedStudentEducation: IStudentEducation | null;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: StudentEducationState = {
  studentEducations: [],
  selectedStudentEducation: null,
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

const studentEducationSlice = createSlice({
  name: 'studentEducations',
  initialState,
  reducers: {
    setStudentEducations: (state, action: PayloadAction<IStudentEducation[]>) => {
      state.studentEducations = action.payload;
    },
    addStudentEducation: (state, action: PayloadAction<IStudentEducation>) => {
      state.studentEducations.unshift(action.payload);
    },
    updateStudentEducation: (state, action: PayloadAction<IStudentEducation>) => {
      const index = state.studentEducations.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.studentEducations[index] = action.payload;
      }
    },
    deleteStudentEducation: (state, action: PayloadAction<number>) => {
      state.studentEducations = state.studentEducations.filter(
        (item) => item.id !== action.payload,
      );
    },
    setSelectedStudentEducation: (state, action: PayloadAction<IStudentEducation | null>) => {
      state.selectedStudentEducation = action.payload;
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
    setPagination: (state, action: PayloadAction<StudentEducationState['pagination']>) => {
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
  setStudentEducations,
  addStudentEducation,
  updateStudentEducation,
  deleteStudentEducation,
  setSelectedStudentEducation,
  setListStatus,
  setDetailsStatus,
  setActionStatus,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = studentEducationSlice.actions;

export default studentEducationSlice.reducer;
