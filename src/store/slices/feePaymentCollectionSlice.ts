import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IFeePaymentCollection } from '@/types/feePaymentCollection';

interface IFeePaymentCollectionsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  feePaymentCollections: IFeePaymentCollection[];
  selectedFeePaymentCollection: IFeePaymentCollection | null;
  pagination: IPaginationMeta;
}

const initialState: IFeePaymentCollectionsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  feePaymentCollections: [],
  selectedFeePaymentCollection: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const feePaymentCollectionSlice = createSlice({
  name: 'feePaymentCollections',
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
    setFeePaymentCollections: (state, action: PayloadAction<IFeePaymentCollection[]>) => {
      state.feePaymentCollections = action.payload;
    },
    addFeePaymentCollection: (state, action: PayloadAction<IFeePaymentCollection>) => {
      state.feePaymentCollections.unshift(action.payload);
    },
    updateFeePaymentCollection: (state, action: PayloadAction<IFeePaymentCollection>) => {
      const index = state.feePaymentCollections.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.feePaymentCollections[index] = action.payload;
      if (state.selectedFeePaymentCollection?.id === action.payload.id)
        state.selectedFeePaymentCollection = action.payload;
    },
    deleteFeePaymentCollection: (state, action: PayloadAction<number>) => {
      state.feePaymentCollections = state.feePaymentCollections.filter(
        (item) => item.id !== action.payload,
      );
      if (state.selectedFeePaymentCollection?.id === action.payload)
        state.selectedFeePaymentCollection = null;
    },
    setSelectedFeePaymentCollection: (
      state,
      action: PayloadAction<IFeePaymentCollection | null>,
    ) => {
      state.selectedFeePaymentCollection = action.payload;
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
  setFeePaymentCollections,
  addFeePaymentCollection,
  updateFeePaymentCollection,
  deleteFeePaymentCollection,
  setSelectedFeePaymentCollection,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = feePaymentCollectionSlice.actions;

export default feePaymentCollectionSlice.reducer;
