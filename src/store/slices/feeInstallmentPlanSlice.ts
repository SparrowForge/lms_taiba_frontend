import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Status} from '@/enums';

import {IPaginationMeta, IStatusState} from '@/types/common';
import {IFeeInstallmentPlan} from '@/types/feeInstallmentPlan';

interface FeeInstallmentPlanState {
  feeInstallmentPlans: IFeeInstallmentPlan[];
  selectedFeeInstallmentPlan: IFeeInstallmentPlan | null;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: FeeInstallmentPlanState = {
  feeInstallmentPlans: [],
  selectedFeeInstallmentPlan: null,
  listStatus: {
    status: Status.INITIAL,
  },
  detailsStatus: {
    status: Status.INITIAL,
  },
  actionStatus: {
    status: Status.INITIAL,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const feeInstallmentPlanSlice = createSlice({
  name: 'feeInstallmentPlans',
  initialState,
  reducers: {
    setFeeInstallmentPlans: (state, action: PayloadAction<IFeeInstallmentPlan[]>) => {
      state.feeInstallmentPlans = action.payload;
    },
    addFeeInstallmentPlan: (state, action: PayloadAction<IFeeInstallmentPlan>) => {
      state.feeInstallmentPlans.unshift(action.payload);
    },
    updateFeeInstallmentPlan: (state, action: PayloadAction<IFeeInstallmentPlan>) => {
      const index = state.feeInstallmentPlans.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.feeInstallmentPlans[index] = action.payload;
      }
    },
    deleteFeeInstallmentPlan: (state, action: PayloadAction<number>) => {
      state.feeInstallmentPlans = state.feeInstallmentPlans.filter(
        (item) => item.id !== action.payload,
      );
    },
    setSelectedFeeInstallmentPlan: (state, action: PayloadAction<IFeeInstallmentPlan | null>) => {
      state.selectedFeeInstallmentPlan = action.payload;
    },
    setListStatus: (state, action: PayloadAction<{ status: Status; message?: string }>) => {
      state.listStatus = action.payload;
    },
    setDetailsStatus: (state, action: PayloadAction<{ status: Status; message?: string }>) => {
      state.detailsStatus = action.payload;
    },
    setActionStatus: (state, action: PayloadAction<{ status: Status; message?: string }>) => {
      state.actionStatus = action.payload;
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
  setFeeInstallmentPlans,
  addFeeInstallmentPlan,
  updateFeeInstallmentPlan,
  deleteFeeInstallmentPlan,
  setSelectedFeeInstallmentPlan,
  setListStatus,
  setDetailsStatus,
  setActionStatus,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = feeInstallmentPlanSlice.actions;

export default feeInstallmentPlanSlice.reducer;
