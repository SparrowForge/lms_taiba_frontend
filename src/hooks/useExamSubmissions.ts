import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import {
  IExamSubmission,
  IExamSubmissionCreate,
  IExamSubmissionUpdate,
} from '@/types/examSubmission';

import { examSubmissionService } from '@/services/examSubmissionService';

import {
  addExamSubmission,
  clearActionStatus,
  clearDetailsStatus,
  deleteExamSubmission,
  setActionStatus,
  setDetailsStatus,
  setExamSubmissions,
  setListStatus,
  setPagination,
  setSelectedExamSubmission,
  updateExamSubmission,
} from '@/store/slices/examSubmissionSlice';

export const useExamSubmissions = () => {
  const dispatch = useDispatch();
  const {
    examSubmissions,
    selectedExamSubmission,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.examSubmissions);

  const loadExamSubmissions = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response = await examSubmissionService.getExamSubmissions(params);
        dispatch(setExamSubmissions(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load exam submissions'
            : 'Failed to load exam submissions';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadExamSubmission = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response = await examSubmissionService.getExamSubmission(id);
        dispatch(setSelectedExamSubmission(response));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load exam submission'
            : 'Failed to load exam submission';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createExamSubmission = useCallback(
    async (data: IExamSubmissionCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await examSubmissionService.createExamSubmission(data);
        dispatch(addExamSubmission(response));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create exam submission'
            : 'Failed to create exam submission';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editExamSubmission = useCallback(
    async (id: number, data: IExamSubmissionUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await examSubmissionService.updateExamSubmission(id, data);
        dispatch(updateExamSubmission(response));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update exam submission'
            : 'Failed to update exam submission';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeExamSubmission = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await examSubmissionService.deleteExamSubmission(id);
        dispatch(deleteExamSubmission(id));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete exam submission'
            : 'Failed to delete exam submission';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getExamSubmissionById = useCallback(
    (id: number) => {
      if (selectedExamSubmission && selectedExamSubmission.id === id) {
        return;
      }
      const examSubmission = examSubmissions.find((es: IExamSubmission) => es.id === id);
      if (examSubmission) {
        dispatch(setSelectedExamSubmission(examSubmission));
      } else {
        loadExamSubmission(id);
      }
    },
    [examSubmissions, dispatch, loadExamSubmission],
  );

  const clearStatuses = useCallback(() => {
    dispatch(clearActionStatus());
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  return {
    examSubmissions,
    selectedExamSubmission,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
    loadExamSubmissions,
    loadExamSubmission,
    createExamSubmission,
    editExamSubmission,
    removeExamSubmission,
    getExamSubmissionById,
    clearStatuses,
  };
};
