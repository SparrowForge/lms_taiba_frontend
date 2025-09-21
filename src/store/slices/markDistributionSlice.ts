import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IMarkDistribution } from '@/types/markDistribution';

interface IMarkDistributionsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  markDistributions: IMarkDistribution[];
  selectedMarkDistribution: IMarkDistribution | null;
  pagination: IPaginationMeta;
}

const initialState: IMarkDistributionsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  markDistributions: [],
  selectedMarkDistribution: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const markDistributionSlice = createSlice({
  name: 'markDistributions',
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
    setMarkDistributions: (state, action: PayloadAction<IMarkDistribution[]>) => {
      state.markDistributions = action.payload;
    },
    addMarkDistribution: (state, action: PayloadAction<IMarkDistribution>) => {
      state.markDistributions.unshift(action.payload);
    },
    updateMarkDistribution: (state, action: PayloadAction<IMarkDistribution>) => {
      const index = state.markDistributions.findIndex(
        (markDistribution) => markDistribution.id === action.payload.id,
      );
      if (index !== -1) {
        state.markDistributions[index] = action.payload;
      }
      if (state.selectedMarkDistribution?.id === action.payload.id) {
        state.selectedMarkDistribution = action.payload;
      }
    },
    deleteMarkDistribution: (state, action: PayloadAction<number>) => {
      state.markDistributions = state.markDistributions.filter(
        (markDistribution) => markDistribution.id !== action.payload,
      );
      if (state.selectedMarkDistribution?.id === action.payload) {
        state.selectedMarkDistribution = null;
      }
    },
    setSelectedMarkDistribution: (state, action: PayloadAction<IMarkDistribution | null>) => {
      state.selectedMarkDistribution = action.payload;
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
  setMarkDistributions,
  addMarkDistribution,
  updateMarkDistribution,
  deleteMarkDistribution,
  setSelectedMarkDistribution,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = markDistributionSlice.actions;

export default markDistributionSlice.reducer;
