import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { ILead, ILeadActivity, ILeadFunnelStats, ILeadSource } from '@/types/lead';

interface ILeadsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  activitiesStatus: IStatusState;
  statsStatus: IStatusState;
  leads: ILead[];
  selectedLead: ILead | null;
  activities: ILeadActivity[];
  funnelStats: ILeadFunnelStats | null;
  sources: ILeadSource[];
  dueFollowUps: ILead[];
  pagination: IPaginationMeta;
}

const emptyPagination: IPaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const initialState: ILeadsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  activitiesStatus: { status: Status.INITIAL },
  statsStatus: { status: Status.INITIAL },
  leads: [],
  selectedLead: null,
  activities: [],
  funnelStats: null,
  sources: [],
  dueFollowUps: [],
  pagination: emptyPagination,
};

const leadSlice = createSlice({
  name: 'leads',
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
    setActivitiesStatus: (state, action: PayloadAction<IStatusState>) => {
      state.activitiesStatus = action.payload;
    },
    setStatsStatus: (state, action: PayloadAction<IStatusState>) => {
      state.statsStatus = action.payload;
    },
    setLeads: (state, action: PayloadAction<ILead[]>) => {
      state.leads = action.payload;
    },
    addLead: (state, action: PayloadAction<ILead>) => {
      state.leads.unshift(action.payload);
    },
    updateLead: (state, action: PayloadAction<ILead>) => {
      const index = state.leads.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.leads[index] = action.payload;
      if (state.selectedLead?.id === action.payload.id) {
        state.selectedLead = action.payload;
      }
    },
    deleteLead: (state, action: PayloadAction<number>) => {
      state.leads = state.leads.filter((item) => item.id !== action.payload);
      if (state.selectedLead?.id === action.payload) state.selectedLead = null;
    },
    setSelectedLead: (state, action: PayloadAction<ILead | null>) => {
      state.selectedLead = action.payload;
    },
    setActivities: (state, action: PayloadAction<ILeadActivity[]>) => {
      state.activities = action.payload;
    },
    addActivity: (state, action: PayloadAction<ILeadActivity>) => {
      state.activities.unshift(action.payload);
    },
    removeActivity: (state, action: PayloadAction<number>) => {
      state.activities = state.activities.filter((item) => item.id !== action.payload);
    },
    setFunnelStats: (state, action: PayloadAction<ILeadFunnelStats | null>) => {
      state.funnelStats = action.payload;
    },
    setSources: (state, action: PayloadAction<ILeadSource[]>) => {
      state.sources = action.payload;
    },
    setDueFollowUps: (state, action: PayloadAction<ILead[]>) => {
      state.dueFollowUps = action.payload;
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
  setActivitiesStatus,
  setStatsStatus,
  setLeads,
  addLead,
  updateLead,
  deleteLead,
  setSelectedLead,
  setActivities,
  addActivity,
  removeActivity,
  setFunnelStats,
  setSources,
  setDueFollowUps,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = leadSlice.actions;

export default leadSlice.reducer;
