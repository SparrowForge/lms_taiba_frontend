import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IDomainInfo, IUser, IUserFilters, IUsersState } from '@/types/user';

const initialState: IUsersState = {
  // Status fields as IStatusState objects
  listStatus: {
    status: Status.INITIAL,
    message: undefined,
  },
  detailsStatus: {
    status: Status.INITIAL,
    message: undefined,
  },
  domainStatus: {
    status: Status.INITIAL,
    message: undefined,
  },
  actionStatus: {
    status: Status.INITIAL,
    message: undefined,
  },

  // Data
  users: [],
  domains:[],
  selectedUser: null,

  pagination: {
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  filters: {
    page: 1,
    limit: 10,
  },
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // List status actions
    setListStatus: (state, action: PayloadAction<IStatusState>) => {
      state.listStatus = action.payload;
    },

    // Details status actions
    setDetailsStatus: (state, action: PayloadAction<IStatusState>) => {
      state.detailsStatus = action.payload;
    },

        // Details status actions
    setDomainStatus: (state, action: PayloadAction<IStatusState>) => {
      state.domainStatus = action.payload;
    },

    // Action status actions
    setActionStatus: (state, action: PayloadAction<IStatusState>) => {
      state.actionStatus = action.payload;
    },

    // Data actions
    setUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
    },

    // Data actions
    setDomains: (state, action: PayloadAction<IDomainInfo[]>) => {
      state.domains = action.payload;
    },

    // Pagination actions
    setPagination: (state, action: PayloadAction<IPaginationMeta>) => {
      state.pagination = action.payload;
    },

    setSelectedUser: (state, action: PayloadAction<IUser | null>) => {
      state.selectedUser = action.payload;
    },

    addUser: (state, action: PayloadAction<IUser>) => {
      state.users.unshift(action.payload);
      state.pagination.total += 1;
    },

    updateUser: (state, action: PayloadAction<IUser>) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      // Update selected user if it's the same user
      if (state.selectedUser?.id === action.payload.id) {
        state.selectedUser = action.payload;
      }
    },

    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      state.pagination.total -= 1;
      // Clear selected user if it's the deleted user
      if (state.selectedUser?.id === action.payload) {
        state.selectedUser = null;
      }
    },

    // Filter actions
    setFilters: (state, action: PayloadAction<IUserFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = { page: 1, limit: 10 };
    },

    // Clear actions
    clearUsers: (state) => {
      state.users = [];
      state.selectedUser = null;
      state.pagination = initialState.pagination;
      state.listStatus = initialState.listStatus;
      state.detailsStatus = initialState.detailsStatus;
      state.actionStatus = initialState.actionStatus;
    },
  },
});

export const {
  setListStatus,
  setDetailsStatus,
  setDomainStatus,
  setDomains,
  setActionStatus,
  setUsers,
  setSelectedUser,
  addUser,
  updateUser,
  deleteUser,
  setFilters,
  clearFilters,
  clearUsers,
  setPagination,
} = userSlice.actions;

export default userSlice.reducer;
