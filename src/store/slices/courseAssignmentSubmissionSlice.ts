import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { ICourseAssignmentSubmission } from '@/types/courseAssignmentSubmission';

// State interface
interface ICourseAssignmentSubmissionsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  courseAssignmentSubmissions: ICourseAssignmentSubmission[];
  selectedCourseAssignmentSubmission: ICourseAssignmentSubmission | null;
  pagination: IPaginationMeta;
}

// Initial state
const initialState: ICourseAssignmentSubmissionsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  courseAssignmentSubmissions: [],
  selectedCourseAssignmentSubmission: null,
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
const courseAssignmentSubmissionSlice = createSlice({
  name: 'courseAssignmentSubmissions',
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
    setCourseAssignmentSubmissions: (
      state,
      action: PayloadAction<ICourseAssignmentSubmission[]>,
    ) => {
      state.courseAssignmentSubmissions = action.payload;
    },
    addCourseAssignmentSubmission: (state, action: PayloadAction<ICourseAssignmentSubmission>) => {
      state.courseAssignmentSubmissions.unshift(action.payload);
    },
    updateCourseAssignmentSubmission: (
      state,
      action: PayloadAction<ICourseAssignmentSubmission>,
    ) => {
      const index = state.courseAssignmentSubmissions.findIndex(
        (cas) => cas.id === action.payload.id,
      );
      if (index !== -1) {
        state.courseAssignmentSubmissions[index] = action.payload;
      }
      if (state.selectedCourseAssignmentSubmission?.id === action.payload.id) {
        state.selectedCourseAssignmentSubmission = action.payload;
      }
    },
    deleteCourseAssignmentSubmission: (state, action: PayloadAction<number>) => {
      state.courseAssignmentSubmissions = state.courseAssignmentSubmissions.filter(
        (cas) => cas.id !== action.payload,
      );
      if (state.selectedCourseAssignmentSubmission?.id === action.payload) {
        state.selectedCourseAssignmentSubmission = null;
      }
    },
    setSelectedCourseAssignmentSubmission: (
      state,
      action: PayloadAction<ICourseAssignmentSubmission | null>,
    ) => {
      state.selectedCourseAssignmentSubmission = action.payload;
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
  setCourseAssignmentSubmissions,
  addCourseAssignmentSubmission,
  updateCourseAssignmentSubmission,
  deleteCourseAssignmentSubmission,
  setSelectedCourseAssignmentSubmission,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = courseAssignmentSubmissionSlice.actions;

export default courseAssignmentSubmissionSlice.reducer;
