import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IPanel} from '@/types/panel';
import {IPaginationMeta, IStatusState, Status} from '@/types/common';

interface PanelsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  panels: IPanel[];
  selectedPanel: IPanel | null;
  pagination: IPaginationMeta;
}

const initialState: PanelsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  panels: [],
  selectedPanel: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false },
};

const panelSlice = createSlice({
  name: 'panels',
  initialState,
  reducers: {
    setListStatus(state, action: PayloadAction<IStatusState>) {
      state.listStatus = action.payload;
    },
    setDetailsStatus(state, action: PayloadAction<IStatusState>) {
      state.detailsStatus = action.payload;
    },
    setActionStatus(state, action: PayloadAction<IStatusState>) {
      state.actionStatus = action.payload;
      console.log(state.panels);
    },
    setPanels(state, action: PayloadAction<IPanel[]>) {
      state.panels = action.payload;
    },
    setSelectedPanel(state, action: PayloadAction<IPanel | null>) {
      state.selectedPanel = action.payload;
    },
    addPanel(state, action: PayloadAction<IPanel>) {
      state.panels.unshift(action.payload);
    },
    updatePanel(state, action: PayloadAction<IPanel>) {
      const idx = state.panels.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.panels[idx] = action.payload;
    },
    deletePanel(state, action: PayloadAction<number>) {
      state.panels = state.panels.filter(p => p.id !== action.payload);
    },
    setPagination(state, action: PayloadAction<IPaginationMeta>) {
      state.pagination = action.payload;
    },
  },
});

export const {
  setListStatus,
  setDetailsStatus,
  setActionStatus,
  setPanels,
  setSelectedPanel,
  addPanel,
  updatePanel,
  deletePanel,
  setPagination,
} = panelSlice.actions;

export default panelSlice.reducer;
