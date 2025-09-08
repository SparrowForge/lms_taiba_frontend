import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IAttendance } from '@/types/attendance';
import { IPaginationMeta, IStatusState } from '@/types/common';

// State interface
interface IAttendancesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  attendances: IAttendance[];
  selectedAttendance: IAttendance | null;
  pagination: IPaginationMeta;
}

// Initial state
const initialState: IAttendancesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  attendances: [],
  selectedAttendance: null,
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
const attendanceSlice = createSlice({
  name: 'attendances',
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
    setAttendances: (state, action: PayloadAction<IAttendance[]>) => {
      state.attendances = action.payload;
    },
    addAttendance: (state, action: PayloadAction<IAttendance>) => {
      state.attendances.unshift(action.payload);
    },
    updateAttendance: (state, action: PayloadAction<IAttendance>) => {
      const index = state.attendances.findIndex(
        (attendance) => attendance.id === action.payload.id,
      );
      if (index !== -1) {
        state.attendances[index] = action.payload;
      }
      if (state.selectedAttendance?.id === action.payload.id) {
        state.selectedAttendance = action.payload;
      }
    },
    deleteAttendance: (state, action: PayloadAction<number>) => {
      state.attendances = state.attendances.filter(
        (attendance) => attendance.id !== action.payload,
      );
      if (state.selectedAttendance?.id === action.payload) {
        state.selectedAttendance = null;
      }
    },
    setSelectedAttendance: (state, action: PayloadAction<IAttendance | null>) => {
      state.selectedAttendance = action.payload;
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
  setAttendances,
  addAttendance,
  updateAttendance,
  deleteAttendance,
  setSelectedAttendance,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
