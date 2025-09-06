import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Status} from '@/enums';

import {IPaginationMeta, IStatusState} from '@/types/common';
import {ICourseType} from '@/types/courseType';

interface ICourseTypesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  courseTypes: ICourseType[];
  selectedCourseType: ICourseType | null;
  pagination: IPaginationMeta;
}

const initialState: ICourseTypesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  courseTypes: [],
  selectedCourseType: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const courseTypeSlice = createSlice({
  name: 'courseTypes',
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
    setCourseTypes: (state, action: PayloadAction<ICourseType[]>) => {
      state.courseTypes = action.payload;
    },
    addCourseType: (state, action: PayloadAction<ICourseType>) => {
      state.courseTypes.unshift(action.payload);
    },
    updateCourseType: (state, action: PayloadAction<ICourseType>) => {
      const index = state.courseTypes.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.courseTypes[index] = action.payload;
      }
      if (state.selectedCourseType?.id === action.payload.id) {
        state.selectedCourseType = action.payload;
      }
    },
    deleteCourseType: (state, action: PayloadAction<number>) => {
      state.courseTypes = state.courseTypes.filter((item) => item.id !== action.payload);
      if (state.selectedCourseType?.id === action.payload) {
        state.selectedCourseType = null;
      }
    },
    setSelectedCourseType: (state, action: PayloadAction<ICourseType | null>) => {
      state.selectedCourseType = action.payload;
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
  setCourseTypes,
  addCourseType,
  updateCourseType,
  deleteCourseType,
  setSelectedCourseType,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = courseTypeSlice.actions;

export default courseTypeSlice.reducer;
