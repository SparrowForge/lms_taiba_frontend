import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {IPaginationMeta, IStatusState, Status} from '@/types/common';
import {IRoomType} from '@/types/roomType';

interface IRoomTypesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  roomTypes: IRoomType[];
  selectedRoomType: IRoomType | null;
  pagination: IPaginationMeta;
}

const initialState: IRoomTypesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  roomTypes: [],
  selectedRoomType: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const roomTypeSlice = createSlice({
  name: 'roomTypes',
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
    setRoomTypes: (state, action: PayloadAction<IRoomType[]>) => {
      state.roomTypes = action.payload;
    },
    addRoomType: (state, action: PayloadAction<IRoomType>) => {
      state.roomTypes.unshift(action.payload);
    },
    updateRoomType: (state, action: PayloadAction<IRoomType>) => {
      const index = state.roomTypes.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.roomTypes[index] = action.payload;
      if (state.selectedRoomType?.id === action.payload.id)
        state.selectedRoomType = action.payload;
    },
    deleteRoomType: (state, action: PayloadAction<number>) => {
      state.roomTypes = state.roomTypes.filter((item) => item.id !== action.payload);
      if (state.selectedRoomType?.id === action.payload) state.selectedRoomType = null;
    },
    setSelectedRoomType: (state, action: PayloadAction<IRoomType | null>) => {
      state.selectedRoomType = action.payload;
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
  setRoomTypes,
  addRoomType,
  updateRoomType,
  deleteRoomType,
  setSelectedRoomType,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = roomTypeSlice.actions;

export default roomTypeSlice.reducer;
