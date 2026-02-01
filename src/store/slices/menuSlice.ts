import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IMenu } from '@/types/menu';
import { IPanelWithMenus } from '@/types/panel';

// State interface
interface IMenusState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  menus: IMenu[];
  selectedMenu: IMenu | null;
  pagination: IPaginationMeta;
  myMenusStatus: IStatusState;
  myMenus: IMenu[];
  panelsWithMenusStatus: IStatusState;
  panelsWithMenus: IPanelWithMenus[];
}

// Initial state
const initialState: IMenusState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  myMenusStatus: { status: Status.INITIAL },
  menus: [],
  selectedMenu: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  myMenus: [],
  panelsWithMenusStatus: { status: Status.INITIAL },
  panelsWithMenus: [],
};

// Slice
const menuSlice = createSlice({
  name: 'menus',
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
    setMenus: (state, action: PayloadAction<IMenu[]>) => {
      state.menus = action.payload;
    },
    addMenu: (state, action: PayloadAction<IMenu>) => {
      state.menus.unshift(action.payload);
    },
    updateMenu: (state, action: PayloadAction<IMenu>) => {
      const index = state.menus.findIndex((menu) => menu.id === action.payload.id);
      if (index !== -1) {
        state.menus[index] = action.payload;
      }
      if (state.selectedMenu?.id === action.payload.id) {
        state.selectedMenu = action.payload;
      }
    },
    deleteMenu: (state, action: PayloadAction<number>) => {
      state.menus = state.menus.filter((menu) => menu.id !== action.payload);
      if (state.selectedMenu?.id === action.payload) {
        state.selectedMenu = null;
      }
    },
    setSelectedMenu: (state, action: PayloadAction<IMenu | null>) => {
      state.selectedMenu = action.payload;
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
    setMyMenusStatus: (state, action: PayloadAction<IStatusState>) => {
      // ⬅ my menus
      state.myMenusStatus = action.payload;
    },
    setMyMenus: (state, action: PayloadAction<IMenu[]>) => {
      state.myMenus = action.payload;
    },
    clearMyMenus: (state) => {
      state.myMenus = [];
      state.myMenusStatus = { status: Status.INITIAL };
    },
    setPanelsWithMenusStatus: (state, action: PayloadAction<IStatusState>) => {
      state.panelsWithMenusStatus = action.payload;
    },
    setPanelsWithMenus: (state, action: PayloadAction<IPanelWithMenus[]>) => {
      state.panelsWithMenus = action.payload;
    },
  },
});

export const {
  setListStatus,
  setDetailsStatus,
  setActionStatus,
  setMenus,
  addMenu,
  updateMenu,
  deleteMenu,
  setSelectedMenu,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
  setMyMenusStatus,
  setMyMenus,
  clearMyMenus,
  setPanelsWithMenusStatus,
  setPanelsWithMenus,
} = menuSlice.actions;

export default menuSlice.reducer;
