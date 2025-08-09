import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {IPaginationMeta, IStatusState, Status} from '@/types/common';
import {IScheduleType} from '@/types/scheduleType';

interface IScheduleTypesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  scheduleTypes: IScheduleType[];
  selectedScheduleType: IScheduleType | null;
  pagination: IPaginationMeta;
}

const initialState: IScheduleTypesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  scheduleTypes: [],
  selectedScheduleType: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const scheduleTypeSlice = createSlice({
  name: 'scheduleTypes',
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
    setScheduleTypes: (state, action: PayloadAction<IScheduleType[]>) => {
      state.scheduleTypes = action.payload;
    },
    addScheduleType: (state, action: PayloadAction<IScheduleType>) => {
      state.scheduleTypes.unshift(action.payload);
    },
    updateScheduleType: (state, action: PayloadAction<IScheduleType>) => {
      const index = state.scheduleTypes.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.scheduleTypes[index] = action.payload;
      if (state.selectedScheduleType?.id === action.payload.id)
        state.selectedScheduleType = action.payload;
    },
    deleteScheduleType: (state, action: PayloadAction<number>) => {
      state.scheduleTypes = state.scheduleTypes.filter((item) => item.id !== action.payload);
      if (state.selectedScheduleType?.id === action.payload) state.selectedScheduleType = null;
    },
    setSelectedScheduleType: (state, action: PayloadAction<IScheduleType | null>) => {
      state.selectedScheduleType = action.payload;
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
  setScheduleTypes,
  addScheduleType,
  updateScheduleType,
  deleteScheduleType,
  setSelectedScheduleType,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = scheduleTypeSlice.actions;

export default scheduleTypeSlice.reducer;
