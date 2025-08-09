import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {IBranch} from '@/types/branch';
import {IPaginationMeta, IStatusState, Status} from '@/types/common';

// State interface
interface IBranchesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  branches: IBranch[];
  selectedBranch: IBranch | null;
  pagination: IPaginationMeta;
}

// Initial state
const initialState: IBranchesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  branches: [],
  selectedBranch: null,
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
const branchSlice = createSlice({
  name: 'branches',
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
    setBranches: (state, action: PayloadAction<IBranch[]>) => {
      state.branches = action.payload;
    },
    addBranch: (state, action: PayloadAction<IBranch>) => {
      state.branches.unshift(action.payload);
    },
    updateBranch: (state, action: PayloadAction<IBranch>) => {
      const index = state.branches.findIndex((branch) => branch.id === action.payload.id);
      if (index !== -1) {
        state.branches[index] = action.payload;
      }
      if (state.selectedBranch?.id === action.payload.id) {
        state.selectedBranch = action.payload;
      }
    },
    deleteBranch: (state, action: PayloadAction<number>) => {
      state.branches = state.branches.filter((branch) => branch.id !== action.payload);
      if (state.selectedBranch?.id === action.payload) {
        state.selectedBranch = null;
      }
    },
    setSelectedBranch: (state, action: PayloadAction<IBranch | null>) => {
      state.selectedBranch = action.payload;
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
  setBranches,
  addBranch,
  updateBranch,
  deleteBranch,
  setSelectedBranch,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = branchSlice.actions;

export default branchSlice.reducer;
