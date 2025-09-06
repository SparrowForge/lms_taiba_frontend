import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {IPaginationMeta, IStatusState, Status} from '@/types/common';
import {IFeeStructure} from '@/types/feeStructure';

interface IFeeStructuresState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  feeStructures: IFeeStructure[];
  selectedFeeStructure: IFeeStructure | null;
  pagination: IPaginationMeta;
}

const initialState: IFeeStructuresState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  feeStructures: [],
  selectedFeeStructure: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const feeStructureSlice = createSlice({
  name: 'feeStructures',
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
    setFeeStructures: (state, action: PayloadAction<IFeeStructure[]>) => {
      state.feeStructures = action.payload;
    },
    addFeeStructure: (state, action: PayloadAction<IFeeStructure>) => {
      state.feeStructures.unshift(action.payload);
    },
    updateFeeStructure: (state, action: PayloadAction<IFeeStructure>) => {
      const index = state.feeStructures.findIndex(
        (feeStructure) => feeStructure.id === action.payload.id,
      );
      if (index !== -1) {
        state.feeStructures[index] = action.payload;
      }
      if (state.selectedFeeStructure?.id === action.payload.id) {
        state.selectedFeeStructure = action.payload;
      }
    },
    deleteFeeStructure: (state, action: PayloadAction<number>) => {
      state.feeStructures = state.feeStructures.filter(
        (feeStructure) => feeStructure.id !== action.payload,
      );
      if (state.selectedFeeStructure?.id === action.payload) {
        state.selectedFeeStructure = null;
      }
    },
    setSelectedFeeStructure: (state, action: PayloadAction<IFeeStructure | null>) => {
      state.selectedFeeStructure = action.payload;
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
  setFeeStructures,
  addFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  setSelectedFeeStructure,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = feeStructureSlice.actions;

export default feeStructureSlice.reducer;
