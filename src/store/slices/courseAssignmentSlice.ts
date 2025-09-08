import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { ICourseAssignment } from '@/types/courseAssignment';

// State interface
interface ICourseAssignmentsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  courseAssignments: ICourseAssignment[];
  selectedCourseAssignment: ICourseAssignment | null;
  pagination: IPaginationMeta;
}

// Initial state
const initialState: ICourseAssignmentsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  courseAssignments: [],
  selectedCourseAssignment: null,
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
const courseAssignmentSlice = createSlice({
  name: 'courseAssignments',
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
    setCourseAssignments: (state, action: PayloadAction<ICourseAssignment[]>) => {
      state.courseAssignments = action.payload;
    },
    addCourseAssignment: (state, action: PayloadAction<ICourseAssignment>) => {
      state.courseAssignments.unshift(action.payload);
    },
    updateCourseAssignment: (state, action: PayloadAction<ICourseAssignment>) => {
      const index = state.courseAssignments.findIndex((ca) => ca.id === action.payload.id);
      if (index !== -1) {
        state.courseAssignments[index] = action.payload;
      }
      if (state.selectedCourseAssignment?.id === action.payload.id) {
        state.selectedCourseAssignment = action.payload;
      }
    },
    deleteCourseAssignment: (state, action: PayloadAction<number>) => {
      state.courseAssignments = state.courseAssignments.filter((ca) => ca.id !== action.payload);
      if (state.selectedCourseAssignment?.id === action.payload) {
        state.selectedCourseAssignment = null;
      }
    },
    setSelectedCourseAssignment: (state, action: PayloadAction<ICourseAssignment | null>) => {
      state.selectedCourseAssignment = action.payload;
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
  setCourseAssignments,
  addCourseAssignment,
  updateCourseAssignment,
  deleteCourseAssignment,
  setSelectedCourseAssignment,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = courseAssignmentSlice.actions;

export default courseAssignmentSlice.reducer;
