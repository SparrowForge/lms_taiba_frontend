import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Status} from '@/enums';

import {IAudit} from '@/types/audit';
import {IPaginationMeta, IStatusState} from '@/types/common';

interface AuditState {
  audits: IAudit[];
  auditsByResource: IAudit[];
  selectedAudit: IAudit | null;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: AuditState = {
  audits: [],
  auditsByResource: [],
  selectedAudit: null,
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const auditSlice = createSlice({
  name: 'audits',
  initialState,
  reducers: {
    setAudits: (state, action: PayloadAction<IAudit[]>) => {
      state.audits = action.payload;
    },
    setAuditsByResource: (state, action: PayloadAction<IAudit[]>) => {
      state.auditsByResource = action.payload;
    },
    setSelectedAudit: (state, action: PayloadAction<IAudit | null>) => {
      state.selectedAudit = action.payload;
    },
    addAudit: (state, action: PayloadAction<IAudit>) => {
      state.audits.unshift(action.payload);
    },
    updateAudit: (state, action: PayloadAction<IAudit>) => {
      const index = state.audits.findIndex((audit) => audit.id === action.payload.id);
      if (index !== -1) {
        state.audits[index] = action.payload;
      }
    },
    deleteAudit: (state, action: PayloadAction<number>) => {
      state.audits = state.audits.filter((audit) => audit.id !== action.payload);
    },
    clearAudits: (state) => {
      state.audits = [];
    },
    setListStatus: (state, action: PayloadAction<IStatusState>) => {
      state.listStatus = action.payload;
    },
    setDetailsStatus: (state, action: PayloadAction<IStatusState>) => {
      state.detailsStatus = action.payload;
    },
    setActionStatus: (state, action: PayloadAction<IStatusState>) => {
      state.actionStatus = action.payload;
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
  setAudits,
  setAuditsByResource,
  setSelectedAudit,
  addAudit,
  updateAudit,
  deleteAudit,
  clearAudits,
  setListStatus,
  setDetailsStatus,
  setActionStatus,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = auditSlice.actions;

export default auditSlice.reducer;
