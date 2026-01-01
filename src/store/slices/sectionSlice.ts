import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { ISection } from '@/types/section';

// State interface
interface ISectionsState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  sections: ISection[];
  selectedSection: ISection | null;
  pagination: IPaginationMeta;
}

// Initial state
const initialState: ISectionsState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  sections: [],
  selectedSection: null,
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
const sectionSlice = createSlice({
  name: 'sections',
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
    setSections: (state, action: PayloadAction<ISection[]>) => {
      state.sections = action.payload;
    },
    addSection: (state, action: PayloadAction<ISection>) => {
      state.sections.unshift(action.payload);
    },
    updateSection: (state, action: PayloadAction<ISection>) => {
      const index = state.sections.findIndex((section) => section.id === action.payload.id);
      if (index !== -1) {
        state.sections[index] = action.payload;
      }
      if (state.selectedSection?.id === action.payload.id) {
        state.selectedSection = action.payload;
      }
    },
    deleteSection: (state, action: PayloadAction<number>) => {
      state.sections = state.sections.filter((section) => section.id !== action.payload);
      if (state.selectedSection?.id === action.payload) {
        state.selectedSection = null;
      }
    },
    setSelectedSection: (state, action: PayloadAction<ISection | null>) => {
      state.selectedSection = action.payload;
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
  setSections,
  addSection,
  updateSection,
  deleteSection,
  setSelectedSection,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = sectionSlice.actions;

export default sectionSlice.reducer;

