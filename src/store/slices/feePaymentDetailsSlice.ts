import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IFeePaymentDetails } from '@/types/feePaymentDetails';

interface IFeePaymentDetailsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  feePaymentDetails: IFeePaymentDetails[];
  selectedFeePaymentDetail: IFeePaymentDetails | null;
  pagination: IPaginationMeta;
}

const initialState: IFeePaymentDetailsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  feePaymentDetails: [],
  selectedFeePaymentDetail: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const feePaymentDetailsSlice = createSlice({
  name: 'feePaymentDetails',
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
    setFeePaymentDetails: (state, action: PayloadAction<IFeePaymentDetails[]>) => {
      state.feePaymentDetails = action.payload;
    },
    addFeePaymentDetail: (state, action: PayloadAction<IFeePaymentDetails>) => {
      state.feePaymentDetails.unshift(action.payload);
    },
    updateFeePaymentDetail: (state, action: PayloadAction<IFeePaymentDetails>) => {
      const index = state.feePaymentDetails.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.feePaymentDetails[index] = action.payload;
      if (state.selectedFeePaymentDetail?.id === action.payload.id)
        state.selectedFeePaymentDetail = action.payload;
    },
    deleteFeePaymentDetail: (state, action: PayloadAction<number>) => {
      state.feePaymentDetails = state.feePaymentDetails.filter(
        (item) => item.id !== action.payload,
      );
      if (state.selectedFeePaymentDetail?.id === action.payload)
        state.selectedFeePaymentDetail = null;
    },
    setSelectedFeePaymentDetail: (state, action: PayloadAction<IFeePaymentDetails | null>) => {
      state.selectedFeePaymentDetail = action.payload;
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
  setFeePaymentDetails,
  addFeePaymentDetail,
  updateFeePaymentDetail,
  deleteFeePaymentDetail,
  setSelectedFeePaymentDetail,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = feePaymentDetailsSlice.actions;

export default feePaymentDetailsSlice.reducer;
