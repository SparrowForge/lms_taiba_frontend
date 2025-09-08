import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IRoleMenuPermission, IRoleWithMenuPermission } from '@/types/roleMenuPermission';

// State interface
interface IRoleMenuPermissionsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  roleMenuPermissions: IRoleMenuPermission[];
  selectedRoleMenuPermission: IRoleMenuPermission | null;
  pagination: IPaginationMeta;
  rolesWithPermissionsStatus: IStatusState;
  rolesWithPermissions: IRoleWithMenuPermission[];
}

// Initial state
const initialState: IRoleMenuPermissionsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  roleMenuPermissions: [],
  selectedRoleMenuPermission: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  rolesWithPermissionsStatus: { status: Status.INITIAL },
  rolesWithPermissions: [],
};

// Slice
const roleMenuPermissionSlice = createSlice({
  name: 'roleMenuPermissions',
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
    setRoleMenuPermissions: (state, action: PayloadAction<IRoleMenuPermission[]>) => {
      state.roleMenuPermissions = action.payload;
    },
    addRoleMenuPermission: (state, action: PayloadAction<IRoleMenuPermission>) => {
      state.roleMenuPermissions.unshift(action.payload);
    },
    updateRoleMenuPermission: (state, action: PayloadAction<IRoleMenuPermission>) => {
      const index = state.roleMenuPermissions.findIndex(
        (permission) => permission.id === action.payload.id,
      );
      if (index !== -1) {
        state.roleMenuPermissions[index] = action.payload;
      }
      if (state.selectedRoleMenuPermission?.id === action.payload.id) {
        state.selectedRoleMenuPermission = action.payload;
      }
    },
    deleteRoleMenuPermission: (state, action: PayloadAction<number>) => {
      state.roleMenuPermissions = state.roleMenuPermissions.filter(
        (permission) => permission.id !== action.payload,
      );
      if (state.selectedRoleMenuPermission?.id === action.payload) {
        state.selectedRoleMenuPermission = null;
      }
    },
    setSelectedRoleMenuPermission: (state, action: PayloadAction<IRoleMenuPermission | null>) => {
      state.selectedRoleMenuPermission = action.payload;
    },
    setPagination: (state, action: PayloadAction<IPaginationMeta>) => {
      state.pagination = action.payload;
    },
    setRolesWithPermissionsStatus: (state, action: PayloadAction<IStatusState>) => {
      state.rolesWithPermissionsStatus = action.payload;
    },
    setRolesWithPermissions: (state, action: PayloadAction<IRoleWithMenuPermission[]>) => {
      state.rolesWithPermissions = action.payload;
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
  setRoleMenuPermissions,
  addRoleMenuPermission,
  updateRoleMenuPermission,
  deleteRoleMenuPermission,
  setSelectedRoleMenuPermission,
  setPagination,
  setRolesWithPermissionsStatus,
  setRolesWithPermissions,
  clearActionStatus,
  clearDetailsStatus,
} = roleMenuPermissionSlice.actions;

export default roleMenuPermissionSlice.reducer;
