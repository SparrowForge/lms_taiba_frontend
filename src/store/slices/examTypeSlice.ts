import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IExamType } from '@/types/examType';

interface IExamTypesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  examTypes: IExamType[];
  selectedExamType: IExamType | null;
  pagination: IPaginationMeta;
}

const initialState: IExamTypesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  examTypes: [],
  selectedExamType: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const examTypeSlice = createSlice({
  name: 'examTypes',
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
    setExamTypes: (state, action: PayloadAction<IExamType[]>) => {
      state.examTypes = action.payload;
    },
    addExamType: (state, action: PayloadAction<IExamType>) => {
      state.examTypes.unshift(action.payload);
    },
    updateExamType: (state, action: PayloadAction<IExamType>) => {
      const index = state.examTypes.findIndex((examType) => examType.id === action.payload.id);
      if (index !== -1) {
        state.examTypes[index] = action.payload;
      }
      if (state.selectedExamType?.id === action.payload.id) {
        state.selectedExamType = action.payload;
      }
    },
    deleteExamType: (state, action: PayloadAction<number>) => {
      state.examTypes = state.examTypes.filter((examType) => examType.id !== action.payload);
      if (state.selectedExamType?.id === action.payload) {
        state.selectedExamType = null;
      }
    },
    setSelectedExamType: (state, action: PayloadAction<IExamType | null>) => {
      state.selectedExamType = action.payload;
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
  setExamTypes,
  addExamType,
  updateExamType,
  deleteExamType,
  setSelectedExamType,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = examTypeSlice.actions;

export default examTypeSlice.reducer;
