import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IRole} from '@/types/role';
import {IPaginationMeta, IStatusState, Status} from '@/types/common';

// State interface
interface IRolesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  roles: IRole[];
  selectedRole: IRole | null;
  pagination: IPaginationMeta;
}

// Initial state
const initialState: IRolesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  roles: [],
  selectedRole: null,
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
const roleSlice = createSlice({
  name: 'roles',
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
    setRoles: (state, action: PayloadAction<IRole[]>) => {
      state.roles = action.payload;
    },
    addRole: (state, action: PayloadAction<IRole>) => {
      state.roles.unshift(action.payload);
    },
    updateRole: (state, action: PayloadAction<IRole>) => {
      const index = state.roles.findIndex(role => role.id === action.payload.id);
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
      if (state.selectedRole?.id === action.payload.id) {
        state.selectedRole = action.payload;
      }
    },
    deleteRole: (state, action: PayloadAction<number>) => {
      state.roles = state.roles.filter(role => role.id !== action.payload);
      if (state.selectedRole?.id === action.payload) {
        state.selectedRole = null;
      }
    },
    setSelectedRole: (state, action: PayloadAction<IRole | null>) => {
      state.selectedRole = action.payload;
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
  setRoles,
  addRole,
  updateRole,
  deleteRole,
  setSelectedRole,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = roleSlice.actions;

export default roleSlice.reducer;
