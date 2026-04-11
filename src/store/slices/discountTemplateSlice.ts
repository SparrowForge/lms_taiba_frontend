import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IDiscountTemplate } from '@/types/discountTemplate';

interface IDiscountTemplatesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  discountTemplates: IDiscountTemplate[];
  selectedDiscountTemplate: IDiscountTemplate | null;
  pagination: IPaginationMeta;
}

const initialState: IDiscountTemplatesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  discountTemplates: [],
  selectedDiscountTemplate: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const discountTemplateSlice = createSlice({
  name: 'discountTemplates',
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
    setDiscountTemplates: (state, action: PayloadAction<IDiscountTemplate[]>) => {
      state.discountTemplates = action.payload;
    },
    addDiscountTemplate: (state, action: PayloadAction<IDiscountTemplate>) => {
      state.discountTemplates.unshift(action.payload);
    },
    updateDiscountTemplate: (state, action: PayloadAction<IDiscountTemplate>) => {
      const index = state.discountTemplates.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.discountTemplates[index] = action.payload;
      }
      if (state.selectedDiscountTemplate?.id === action.payload.id) {
        state.selectedDiscountTemplate = action.payload;
      }
    },
    deleteDiscountTemplate: (state, action: PayloadAction<number>) => {
      state.discountTemplates = state.discountTemplates.filter(
        (item) => item.id !== action.payload,
      );
      if (state.selectedDiscountTemplate?.id === action.payload) {
        state.selectedDiscountTemplate = null;
      }
    },
    setSelectedDiscountTemplate: (state, action: PayloadAction<IDiscountTemplate | null>) => {
      state.selectedDiscountTemplate = action.payload;
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
  setDiscountTemplates,
  addDiscountTemplate,
  updateDiscountTemplate,
  deleteDiscountTemplate,
  setSelectedDiscountTemplate,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = discountTemplateSlice.actions;

export default discountTemplateSlice.reducer;

