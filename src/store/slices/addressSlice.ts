import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Status} from '@/enums';

import {IAddress} from '@/types/address';
import {IPaginationMeta, IStatusState} from '@/types/common';

interface IAddressesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  addresses: IAddress[];
  selectedAddress: IAddress | null;
  pagination: IPaginationMeta;
}

const initialState: IAddressesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  addresses: [],
  selectedAddress: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const addressSlice = createSlice({
  name: 'addresses',
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
    setAddresses: (state, action: PayloadAction<IAddress[]>) => {
      state.addresses = action.payload;
    },
    addAddress: (state, action: PayloadAction<IAddress>) => {
      state.addresses.unshift(action.payload);
    },
    updateAddress: (state, action: PayloadAction<IAddress>) => {
      const index = state.addresses.findIndex((address) => address.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
      if (state.selectedAddress?.id === action.payload.id) {
        state.selectedAddress = action.payload;
      }
    },
    deleteAddress: (state, action: PayloadAction<number>) => {
      state.addresses = state.addresses.filter((address) => address.id !== action.payload);
      if (state.selectedAddress?.id === action.payload) {
        state.selectedAddress = null;
      }
    },
    setSelectedAddress: (state, action: PayloadAction<IAddress | null>) => {
      state.selectedAddress = action.payload;
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
  setAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setSelectedAddress,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = addressSlice.actions;

export default addressSlice.reducer;
