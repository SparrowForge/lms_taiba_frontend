import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { ICourse } from '@/types/course';

// State interface
interface ICoursesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  courses: ICourse[];
  selectedCourse: ICourse | null;
  pagination: IPaginationMeta;
}

// Initial state
const initialState: ICoursesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  courses: [],
  selectedCourse: null,
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
const courseSlice = createSlice({
  name: 'courses',
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
    setCourses: (state, action: PayloadAction<ICourse[]>) => {
      state.courses = action.payload;
    },
    addCourse: (state, action: PayloadAction<ICourse>) => {
      state.courses.unshift(action.payload);
    },
    updateCourse: (state, action: PayloadAction<ICourse>) => {
      const index = state.courses.findIndex((course) => course.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
      if (state.selectedCourse?.id === action.payload.id) {
        state.selectedCourse = action.payload;
      }
    },
    deleteCourse: (state, action: PayloadAction<number>) => {
      state.courses = state.courses.filter((course) => course.id !== action.payload);
      if (state.selectedCourse?.id === action.payload) {
        state.selectedCourse = null;
      }
    },
    setSelectedCourse: (state, action: PayloadAction<ICourse | null>) => {
      state.selectedCourse = action.payload;
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
  setCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  setSelectedCourse,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = courseSlice.actions;

export default courseSlice.reducer;
