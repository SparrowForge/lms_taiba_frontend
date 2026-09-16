import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { I__PascalSingular__ } from '@/types/__camelSingular__';

interface I__PascalPlural__State {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  __camelPlural__: I__PascalSingular__[];
  selected__PascalSingular__: I__PascalSingular__ | null;
  pagination: IPaginationMeta;
}

const initialState: I__PascalPlural__State = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  __camelPlural__: [],
  selected__PascalSingular__: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const __camelSingular__Slice = createSlice({
  name: '__camelPlural__',
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
    set__PascalPlural__: (state, action: PayloadAction<I__PascalSingular__[]>) => {
      state.__camelPlural__ = action.payload;
    },
    add__PascalSingular__: (state, action: PayloadAction<I__PascalSingular__>) => {
      state.__camelPlural__.unshift(action.payload);
    },
    update__PascalSingular__: (state, action: PayloadAction<I__PascalSingular__>) => {
      const index = state.__camelPlural__.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.__camelPlural__[index] = action.payload;
      if (state.selected__PascalSingular__?.id === action.payload.id)
        state.selected__PascalSingular__ = action.payload;
    },
    delete__PascalSingular__: (state, action: PayloadAction<number>) => {
      state.__camelPlural__ = state.__camelPlural__.filter((item) => item.id !== action.payload);
      if (state.selected__PascalSingular__?.id === action.payload)
        state.selected__PascalSingular__ = null;
    },
    setSelected__PascalSingular__: (state, action: PayloadAction<I__PascalSingular__ | null>) => {
      state.selected__PascalSingular__ = action.payload;
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
  set__PascalPlural__,
  add__PascalSingular__,
  update__PascalSingular__,
  delete__PascalSingular__,
  setSelected__PascalSingular__,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = __camelSingular__Slice.actions;

export default __camelSingular__Slice.reducer;
