import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Status} from '@/enums';

import {IPaginationMeta, IStatusState} from '@/types/common';
import {ICourseMaterial} from '@/types/courseMaterial';

interface CourseMaterialState {
  courseMaterials: ICourseMaterial[];
  selectedCourseMaterial: ICourseMaterial | null;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: CourseMaterialState = {
  courseMaterials: [],
  selectedCourseMaterial: null,
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

const courseMaterialSlice = createSlice({
  name: 'courseMaterials',
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
    setCourseMaterials: (state, action: PayloadAction<ICourseMaterial[]>) => {
      state.courseMaterials = action.payload;
    },
    addCourseMaterial: (state, action: PayloadAction<ICourseMaterial>) => {
      state.courseMaterials.unshift(action.payload);
    },
    updateCourseMaterial: (state, action: PayloadAction<ICourseMaterial>) => {
      const index = state.courseMaterials.findIndex((cm) => cm.id === action.payload.id);
      if (index !== -1) {
        state.courseMaterials[index] = action.payload;
      }
    },
    deleteCourseMaterial: (state, action: PayloadAction<number>) => {
      state.courseMaterials = state.courseMaterials.filter((cm) => cm.id !== action.payload);
    },
    setSelectedCourseMaterial: (state, action: PayloadAction<ICourseMaterial | null>) => {
      state.selectedCourseMaterial = action.payload;
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
  setCourseMaterials,
  addCourseMaterial,
  updateCourseMaterial,
  deleteCourseMaterial,
  setSelectedCourseMaterial,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = courseMaterialSlice.actions;

export default courseMaterialSlice.reducer;
