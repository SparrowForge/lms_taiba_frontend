import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import {
  ISubjectDiscussion,
  ISubjectDiscussionCreate,
  ISubjectDiscussionUpdate,
} from '@/types/subjectDiscussion';

import { subjectDiscussionService } from '@/services/subjectDiscussionService';

import {
  addSubjectDiscussion,
  clearActionStatus,
  clearDetailsStatus,
  deleteSubjectDiscussion,
  setActionStatus,
  setSubjectDiscussions,
  setDetailsStatus,
  setListStatus,
  setPagination,
  setSelectedSubjectDiscussion,
  updateSubjectDiscussion,
} from '@/store/slices/subjectDiscussionSlice';

export const useSubjectDiscussions = () => {
  const dispatch = useDispatch();
  const {
    subjectDiscussions,
    selectedSubjectDiscussion,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.subjectDiscussions);

  const loadSubjectDiscussions = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response = await subjectDiscussionService.getSubjectDiscussions(params);
        dispatch(setSubjectDiscussions(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load subject discussions'
            : 'Failed to load subject discussions';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadSubjectDiscussion = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response = await subjectDiscussionService.getSubjectDiscussion(id);
        dispatch(setSelectedSubjectDiscussion(response));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load subject discussion'
            : 'Failed to load subject discussion';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createSubjectDiscussion = useCallback(
    async (data: ISubjectDiscussionCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await subjectDiscussionService.createSubjectDiscussion(data);
        dispatch(addSubjectDiscussion(response));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create subject discussion'
            : 'Failed to create subject discussion';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editSubjectDiscussion = useCallback(
    async (id: number, data: ISubjectDiscussionUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await subjectDiscussionService.updateSubjectDiscussion(id, data);
        dispatch(updateSubjectDiscussion(response));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update subject discussion'
            : 'Failed to update subject discussion';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeSubjectDiscussion = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await subjectDiscussionService.deleteSubjectDiscussion(id);
        dispatch(deleteSubjectDiscussion(id));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete subject discussion'
            : 'Failed to delete subject discussion';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getSubjectDiscussionById = useCallback(
    (id: number) => {
      if (selectedSubjectDiscussion && selectedSubjectDiscussion.id === id) {
        return;
      }
      const subjectDiscussion = subjectDiscussions.find(
        (sd: ISubjectDiscussion) => sd.id === id,
      );
      if (subjectDiscussion) {
        dispatch(setSelectedSubjectDiscussion(subjectDiscussion));
      } else {
        loadSubjectDiscussion(id);
      }
    },
    [subjectDiscussions, dispatch, loadSubjectDiscussion],
  );

  const clearStatuses = useCallback(() => {
    dispatch(clearActionStatus());
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  return {
    subjectDiscussions,
    selectedSubjectDiscussion,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
    loadSubjectDiscussions,
    loadSubjectDiscussion,
    createSubjectDiscussion,
    editSubjectDiscussion,
    removeSubjectDiscussion,
    getSubjectDiscussionById,
    clearStatuses,
  };
};
