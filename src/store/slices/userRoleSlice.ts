import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IUserRole } from '@/types/userRole';

interface IUserRolesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  userRoles: IUserRole[];
  selectedUserRole: IUserRole | null;
  pagination: IPaginationMeta;
}

const initialState: IUserRolesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  userRoles: [],
  selectedUserRole: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const userRoleSlice = createSlice({
  name: 'userRoles',
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
    setUserRoles: (state, action: PayloadAction<IUserRole[]>) => {
      state.userRoles = action.payload;
    },
    addUserRole: (state, action: PayloadAction<IUserRole>) => {
      state.userRoles.unshift(action.payload);
    },
    updateUserRole: (state, action: PayloadAction<IUserRole>) => {
      const index = state.userRoles.findIndex((userRole) => userRole.id === action.payload.id);
      if (index !== -1) {
        state.userRoles[index] = action.payload;
      }
      if (state.selectedUserRole?.id === action.payload.id) {
        state.selectedUserRole = action.payload;
      }
    },
    deleteUserRole: (state, action: PayloadAction<number>) => {
      state.userRoles = state.userRoles.filter((userRole) => userRole.id !== action.payload);
      if (state.selectedUserRole?.id === action.payload) {
        state.selectedUserRole = null;
      }
    },
    setSelectedUserRole: (state, action: PayloadAction<IUserRole | null>) => {
      state.selectedUserRole = action.payload;
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
  setUserRoles,
  addUserRole,
  updateUserRole,
  deleteUserRole,
  setSelectedUserRole,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = userRoleSlice.actions;

export default userRoleSlice.reducer;
