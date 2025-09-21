import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IPaginationMeta, IStatusState } from '@/types/common';
import { IGradeRule } from '@/types/gradeRule';

interface IGradeRulesState {
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  gradeRules: IGradeRule[];
  selectedGradeRule: IGradeRule | null;
  pagination: IPaginationMeta;
}

const initialState: IGradeRulesState = {
  listStatus: { status: Status.INITIAL },
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
  gradeRules: [],
  selectedGradeRule: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const gradeRuleSlice = createSlice({
  name: 'gradeRules',
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
    setGradeRules: (state, action: PayloadAction<IGradeRule[]>) => {
      state.gradeRules = action.payload;
    },
    addGradeRule: (state, action: PayloadAction<IGradeRule>) => {
      state.gradeRules.unshift(action.payload);
    },
    updateGradeRule: (state, action: PayloadAction<IGradeRule>) => {
      const index = state.gradeRules.findIndex((gradeRule) => gradeRule.id === action.payload.id);
      if (index !== -1) {
        state.gradeRules[index] = action.payload;
      }
      if (state.selectedGradeRule?.id === action.payload.id) {
        state.selectedGradeRule = action.payload;
      }
    },
    deleteGradeRule: (state, action: PayloadAction<number>) => {
      state.gradeRules = state.gradeRules.filter((gradeRule) => gradeRule.id !== action.payload);
      if (state.selectedGradeRule?.id === action.payload) {
        state.selectedGradeRule = null;
      }
    },
    setSelectedGradeRule: (state, action: PayloadAction<IGradeRule | null>) => {
      state.selectedGradeRule = action.payload;
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
  setGradeRules,
  addGradeRule,
  updateGradeRule,
  deleteGradeRule,
  setSelectedGradeRule,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = gradeRuleSlice.actions;

export default gradeRuleSlice.reducer;
