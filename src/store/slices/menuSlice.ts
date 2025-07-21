import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IMenu} from '@/types/menu';
import {IPaginationMeta, IStatusState, Status} from '@/types/common';

// State interface
interface IMenusState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  menus: IMenu[];
  selectedMenu: IMenu | null;
  pagination: IPaginationMeta;
}

// Initial state
const initialState: IMenusState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
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
      const index = state.menus.findIndex(menu => menu.id === action.payload.id);
      if (index !== -1) {
        state.menus[index] = action.payload;
      }
      if (state.selectedMenu?.id === action.payload.id) {
        state.selectedMenu = action.payload;
      }
    },
    deleteMenu: (state, action: PayloadAction<number>) => {
      state.menus = state.menus.filter(menu => menu.id !== action.payload);
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
} = menuSlice.actions;

export default menuSlice.reducer;
