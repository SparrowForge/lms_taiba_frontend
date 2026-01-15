import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Status } from '@/enums';

import { IStatusState } from '@/types/common';
import { ISubjectDiscussionReply } from '@/types/subjectDiscussionReply';

interface SubjectDiscussionReplyState {
  selectedSubjectDiscussionReply: ISubjectDiscussionReply | null;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;
}

const initialState: SubjectDiscussionReplyState = {
  selectedSubjectDiscussionReply: null,
  detailsStatus: { status: Status.INITIAL },
  actionStatus: { status: Status.INITIAL },
};

const subjectDiscussionReplySlice = createSlice({
  name: 'subjectDiscussionReplies',
  initialState,
  reducers: {
    setDetailsStatus: (state, action: PayloadAction<IStatusState>) => {
      state.detailsStatus = action.payload;
    },
    setActionStatus: (state, action: PayloadAction<IStatusState>) => {
      state.actionStatus = action.payload;
    },
    setSelectedSubjectDiscussionReply: (
      state,
      action: PayloadAction<ISubjectDiscussionReply | null>,
    ) => {
      state.selectedSubjectDiscussionReply = action.payload;
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
  setDetailsStatus,
  setActionStatus,
  setSelectedSubjectDiscussionReply,
  clearActionStatus,
  clearDetailsStatus,
} = subjectDiscussionReplySlice.actions;

export default subjectDiscussionReplySlice.reducer;
