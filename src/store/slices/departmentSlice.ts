import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Status} from '@/enums';

import {IPaginationMeta, IStatusState} from '@/types/common';
import {IDepartment} from '@/types/department';

// State interface
interface IDepartmentsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  departments: IDepartment[];
  selectedDepartment: IDepartment | null;
  pagination: IPaginationMeta;
}

// Initial state
const initialState: IDepartmentsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  departments: [],
  selectedDepartment: null,
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
const departmentSlice = createSlice({
  name: 'departments',
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
    setDepartments: (state, action: PayloadAction<IDepartment[]>) => {
      state.departments = action.payload;
    },
    addDepartment: (state, action: PayloadAction<IDepartment>) => {
      state.departments.unshift(action.payload);
    },
    updateDepartment: (state, action: PayloadAction<IDepartment>) => {
      const index = state.departments.findIndex(
        (department) => department.id === action.payload.id,
      );
      if (index !== -1) {
        state.departments[index] = action.payload;
      }
      if (state.selectedDepartment?.id === action.payload.id) {
        state.selectedDepartment = action.payload;
      }
    },
    deleteDepartment: (state, action: PayloadAction<number>) => {
      state.departments = state.departments.filter(
        (department) => department.id !== action.payload,
      );
      if (state.selectedDepartment?.id === action.payload) {
        state.selectedDepartment = null;
      }
    },
    setSelectedDepartment: (state, action: PayloadAction<IDepartment | null>) => {
      state.selectedDepartment = action.payload;
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
  setDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  setSelectedDepartment,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = departmentSlice.actions;

export default departmentSlice.reducer;
