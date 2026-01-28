import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IRoom } from '@/types/room';

interface IRoomsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  rooms: IRoom[];
  selectedRoom: IRoom | null;
  pagination: IPaginationMeta;
  availableRooms: IRoom[];
  availableRoomsStatus: IStatusState;
}

const initialState: IRoomsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  rooms: [],
  selectedRoom: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  availableRooms: [],
  availableRoomsStatus: { status: Status.INITIAL },
};

const roomSlice = createSlice({
  name: 'rooms',
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
    setRooms: (state, action: PayloadAction<IRoom[]>) => {
      state.rooms = action.payload;
    },
    addRoom: (state, action: PayloadAction<IRoom>) => {
      state.rooms.unshift(action.payload);
    },
    updateRoom: (state, action: PayloadAction<IRoom>) => {
      const index = state.rooms.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.rooms[index] = action.payload;
      if (state.selectedRoom?.id === action.payload.id) state.selectedRoom = action.payload;
    },
    deleteRoom: (state, action: PayloadAction<number>) => {
      state.rooms = state.rooms.filter((item) => item.id !== action.payload);
      if (state.selectedRoom?.id === action.payload) state.selectedRoom = null;
    },
    setSelectedRoom: (state, action: PayloadAction<IRoom | null>) => {
      state.selectedRoom = action.payload;
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
    setAvailableRooms: (state, action: PayloadAction<IRoom[]>) => {
      state.availableRooms = action.payload;
    },
    setAvailableRoomsStatus: (state, action: PayloadAction<IStatusState>) => {
      state.availableRoomsStatus = action.payload;
    },
  },
});

export const {
  setListStatus,
  setDetailsStatus,
  setActionStatus,
  setRooms,
  addRoom,
  updateRoom,
  deleteRoom,
  setSelectedRoom,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
  setAvailableRooms,
  setAvailableRoomsStatus,
} = roomSlice.actions;

export default roomSlice.reducer;
