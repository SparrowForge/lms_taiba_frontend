import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IRoleMenuPermission} from '@/types/roleMenuPermission';
import {IPaginationMeta, IStatusState, Status} from '@/types/common';

// State interface
interface IRoleMenuPermissionsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  roleMenuPermissions: IRoleMenuPermission[];
  selectedRoleMenuPermission: IRoleMenuPermission | null;
  pagination: IPaginationMeta;
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
        permission => permission.roleId === action.payload.roleId && permission.menuId === action.payload.menuId
      );
      if (index !== -1) {
        state.roleMenuPermissions[index] = action.payload;
      }
      if (state.selectedRoleMenuPermission?.roleId === action.payload.roleId &&
          state.selectedRoleMenuPermission?.menuId === action.payload.menuId) {
        state.selectedRoleMenuPermission = action.payload;
      }
    },
    deleteRoleMenuPermission: (state, action: PayloadAction<{ roleId: number; menuId: number }>) => {
      state.roleMenuPermissions = state.roleMenuPermissions.filter(
        permission => !(permission.roleId === action.payload.roleId && permission.menuId === action.payload.menuId)
      );
      if (state.selectedRoleMenuPermission?.roleId === action.payload.roleId &&
          state.selectedRoleMenuPermission?.menuId === action.payload.menuId) {
        state.selectedRoleMenuPermission = null;
      }
    },
    setSelectedRoleMenuPermission: (state, action: PayloadAction<IRoleMenuPermission | null>) => {
      state.selectedRoleMenuPermission = action.payload;
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
  setRoleMenuPermissions,
  addRoleMenuPermission,
  updateRoleMenuPermission,
  deleteRoleMenuPermission,
  setSelectedRoleMenuPermission,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = roleMenuPermissionSlice.actions;

export default roleMenuPermissionSlice.reducer;
