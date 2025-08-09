import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {IBatch} from '@/types/batch';
import {IPaginationMeta, IStatusState, Status} from '@/types/common';

interface IBatchesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  batches: IBatch[];
  selectedBatch: IBatch | null;
  pagination: IPaginationMeta;
}

const initialState: IBatchesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  batches: [],
  selectedBatch: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const batchSlice = createSlice({
  name: 'batches',
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
    setBatches: (state, action: PayloadAction<IBatch[]>) => {
      state.batches = action.payload;
    },
    addBatch: (state, action: PayloadAction<IBatch>) => {
      state.batches.unshift(action.payload);
    },
    updateBatch: (state, action: PayloadAction<IBatch>) => {
      const index = state.batches.findIndex((batch) => batch.id === action.payload.id);
      if (index !== -1) {
        state.batches[index] = action.payload;
      }
      if (state.selectedBatch?.id === action.payload.id) {
        state.selectedBatch = action.payload;
      }
    },
    deleteBatch: (state, action: PayloadAction<number>) => {
      state.batches = state.batches.filter((batch) => batch.id !== action.payload);
      if (state.selectedBatch?.id === action.payload) {
        state.selectedBatch = null;
      }
    },
    setSelectedBatch: (state, action: PayloadAction<IBatch | null>) => {
      state.selectedBatch = action.payload;
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
  setBatches,
  addBatch,
  updateBatch,
  deleteBatch,
  setSelectedBatch,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = batchSlice.actions;

export default batchSlice.reducer;
