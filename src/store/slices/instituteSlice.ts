import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IInstitute } from '@/types/institute';

interface IInstitutesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  institutes: IInstitute[];
  selectedInstitute: IInstitute | null;
  pagination: IPaginationMeta;
}

const initialState: IInstitutesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  institutes: [],
  selectedInstitute: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const instituteSlice = createSlice({
  name: 'institutes',
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
    setInstitutes: (state, action: PayloadAction<IInstitute[]>) => {
      state.institutes = action.payload;
    },
    addInstitute: (state, action: PayloadAction<IInstitute>) => {
      state.institutes.unshift(action.payload);
    },
    updateInstitute: (state, action: PayloadAction<IInstitute>) => {
      const index = state.institutes.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.institutes[index] = action.payload;
      if (state.selectedInstitute?.id === action.payload.id)
        state.selectedInstitute = action.payload;
    },
    deleteInstitute: (state, action: PayloadAction<number>) => {
      state.institutes = state.institutes.filter((item) => item.id !== action.payload);
      if (state.selectedInstitute?.id === action.payload) state.selectedInstitute = null;
    },
    setSelectedInstitute: (state, action: PayloadAction<IInstitute | null>) => {
      state.selectedInstitute = action.payload;
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
  setInstitutes,
  addInstitute,
  updateInstitute,
  deleteInstitute,
  setSelectedInstitute,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = instituteSlice.actions;

export default instituteSlice.reducer;
