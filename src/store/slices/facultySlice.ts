import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IFaculty} from '@/types/faculty';
import {IPaginationMeta, IStatusState, Status} from '@/types/common';

interface FacultyState {
  faculties: IFaculty[];
  selectedFaculty: IFaculty | null;
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
  pagination: IPaginationMeta;
}

const initialState: FacultyState = {
  faculties: [],
  selectedFaculty: null,
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

const facultySlice = createSlice({
  name: 'faculties',
  initialState,
  reducers: {
    setFaculties: (state, action: PayloadAction<IFaculty[]>) => {
      state.faculties = action.payload;
    },
    setSelectedFaculty: (state, action: PayloadAction<IFaculty | null>) => {
      state.selectedFaculty = action.payload;
    },
    addFaculty: (state, action: PayloadAction<IFaculty>) => {
      state.faculties.unshift(action.payload);
    },
    updateFaculty: (state, action: PayloadAction<IFaculty>) => {
      const index = state.faculties.findIndex(
        (faculty) => faculty.id === action.payload.id
      );
      if (index !== -1) {
        state.faculties[index] = action.payload;
      }
    },
    deleteFaculty: (state, action: PayloadAction<number>) => {
      state.faculties = state.faculties.filter(
        (faculty) => faculty.id !== action.payload
      );
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
  setFaculties,
  setSelectedFaculty,
  addFaculty,
  updateFaculty,
  deleteFaculty,
  setListStatus,
  setDetailsStatus,
  setActionStatus,
  setPagination,
  clearActionStatus,
  clearDetailsStatus,
} = facultySlice.actions;

export default facultySlice.reducer; 