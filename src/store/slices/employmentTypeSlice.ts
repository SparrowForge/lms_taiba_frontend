import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Status} from '@/enums';

import {IPaginationMeta, IStatusState} from '@/types/common';
import {IEmploymentType} from '@/types/employmentType';

interface IEmploymentTypesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  employmentTypes: IEmploymentType[];
  selectedEmploymentType: IEmploymentType | null;
  pagination: IPaginationMeta;
}

const initialState: IEmploymentTypesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  employmentTypes: [],
  selectedEmploymentType: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const employmentTypeSlice = createSlice({
  name: 'employmentTypes',
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
    setEmploymentTypes: (state, action: PayloadAction<IEmploymentType[]>) => {
      state.employmentTypes = action.payload;
    },
    addEmploymentType: (state, action: PayloadAction<IEmploymentType>) => {
      state.employmentTypes.unshift(action.payload);
    },
    updateEmploymentType: (state, action: PayloadAction<IEmploymentType>) => {
      const index = state.employmentTypes.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.employmentTypes[index] = action.payload;
      if (state.selectedEmploymentType?.id === action.payload.id)
        state.selectedEmploymentType = action.payload;
    },
    deleteEmploymentType: (state, action: PayloadAction<number>) => {
      state.employmentTypes = state.employmentTypes.filter((item) => item.id !== action.payload);
      if (state.selectedEmploymentType?.id === action.payload) state.selectedEmploymentType = null;
    },
    setSelectedEmploymentType: (state, action: PayloadAction<IEmploymentType | null>) => {
      state.selectedEmploymentType = action.payload;
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
  setEmploymentTypes,
  addEmploymentType,
  updateEmploymentType,
  deleteEmploymentType,
  setSelectedEmploymentType,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = employmentTypeSlice.actions;

export default employmentTypeSlice.reducer;
