import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import {
  ISubjectDiscussionReplyCreate,
  ISubjectDiscussionReplyUpdate,
} from '@/types/subjectDiscussionReply';

import { subjectDiscussionReplyService } from '@/services/subjectDiscussionReplyService';

import {
  clearActionStatus,
  clearDetailsStatus,
  setActionStatus,
  setDetailsStatus,
  setSelectedSubjectDiscussionReply,
} from '@/store/slices/subjectDiscussionReplySlice';

export const useSubjectDiscussionReplies = () => {
  const dispatch = useDispatch();
  const { selectedSubjectDiscussionReply, detailsStatus, actionStatus } = useSelector(
    (state: RootState) => state.subjectDiscussionReplies,
  );

  const loadSubjectDiscussionReply = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response = await subjectDiscussionReplyService.getSubjectDiscussionReply(id);
        dispatch(setSelectedSubjectDiscussionReply(response));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load subject discussion reply'
            : 'Failed to load subject discussion reply';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const createSubjectDiscussionReply = useCallback(
    async (data: ISubjectDiscussionReplyCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await subjectDiscussionReplyService.createSubjectDiscussionReply(data);
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create subject discussion reply'
            : 'Failed to create subject discussion reply';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editSubjectDiscussionReply = useCallback(
    async (id: number, data: ISubjectDiscussionReplyUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await subjectDiscussionReplyService.updateSubjectDiscussionReply(id, data);
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update subject discussion reply'
            : 'Failed to update subject discussion reply';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeSubjectDiscussionReply = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await subjectDiscussionReplyService.deleteSubjectDiscussionReply(id);
        dispatch(setActionStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete subject discussion reply'
            : 'Failed to delete subject discussion reply';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const clearStatuses = useCallback(() => {
    dispatch(clearActionStatus());
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  return {
    selectedSubjectDiscussionReply,
    detailsStatus,
    actionStatus,
    loadSubjectDiscussionReply,
    createSubjectDiscussionReply,
    editSubjectDiscussionReply,
    removeSubjectDiscussionReply,
    clearStatuses,
  };
};
