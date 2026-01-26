import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IExamResult,
  IExamResultCreate,
  IExamResultUpdate,
  ISemesterResult,
  ISemesterResultsPublishRequest,
  ISubjectResult,
  ISubjectResultsPublishRequest,
} from '@/types/examResult';

import { examResultService } from '@/services/examResultService';

import {
  addExamResult,
  clearActionStatus,
  clearDetailsStatus,
  deleteExamResult,
  setActionStatus,
  setDetailsStatus,
  setExamResults,
  setListStatus,
  setPagination,
  setSemesterResults,
  setSelectedExamResult,
  setSubjectResults,
  updateExamResult,
} from '@/store/slices/examResultSlice';

export const useExamResults = () => {
  const dispatch = useDispatch();
  const {
    examResults,
    semesterResults,
    subjectResults,
    selectedExamResult,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.examResults);

  const loadExamResults = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IExamResult> =
          await examResultService.getExamResults(params);
        dispatch(setExamResults(response?.data?.items ?? []));
        dispatch(
          setPagination(
            response?.data?.meta ?? {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          ),
        );
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load exam results'
            : 'Failed to load exam results';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadExamResult = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IExamResult> = await examResultService.getExamResult(id);
        dispatch(setSelectedExamResult(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load exam result'
            : 'Failed to load exam result';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createExamResult = useCallback(
    async (data: IExamResultCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IExamResult = await examResultService.createExamResult(data);
        dispatch(addExamResult(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Exam result created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create exam result'
            : 'Failed to create exam result';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const createExamResultBulk = useCallback(
    async (data: IExamResultCreate[]) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IExamResult = await examResultService.createExamResultBulk(data);
        dispatch(addExamResult(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Exam result created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create exam result'
            : 'Failed to create exam result';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editExamResult = useCallback(
    async (id: number, data: IExamResultUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IExamResult = await examResultService.updateExamResult(id, data);
        dispatch(updateExamResult(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Exam result updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update exam result'
            : 'Failed to update exam result';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeExamResult = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await examResultService.deleteExamResult(id);
        dispatch(deleteExamResult(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Exam result deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete exam result'
            : 'Failed to delete exam result';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getExamResultById = useCallback(
    (id: number) => {
      if (selectedExamResult && selectedExamResult.id === id) {
        return;
      }

      const examResult = examResults.find((examResult) => examResult.id === id);
      if (examResult) {
        dispatch(setSelectedExamResult(examResult));
      } else {
        loadExamResult(id);
      }
    },
    [examResults, selectedExamResult, dispatch, loadExamResult],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (examResult: IExamResult | null) => {
      dispatch(setSelectedExamResult(examResult));
    },
    [dispatch],
  );

  const loadSemesterResults = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<ISemesterResult> =
          await examResultService.getSemesterResults(params);
        dispatch(setSemesterResults(response?.data?.items ?? []));
        dispatch(
          setPagination(
            response?.data?.meta ?? {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          ),
        );
        dispatch(setListStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load semester results'
            : 'Failed to load semester results';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const loadSubjectResults = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<ISubjectResult> =
          await examResultService.getSubjectResults(params);
        dispatch(setSubjectResults(response?.data?.items ?? []));
        dispatch(
          setPagination(
            response?.data?.meta ?? {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          ),
        );
        dispatch(setListStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load subject results'
            : 'Failed to load subject results';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const publishSemesterResults = useCallback(
    async (data: ISemesterResultsPublishRequest) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await examResultService.publishSemesterResults(data);
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Semester results published successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to publish semester results'
            : 'Failed to publish semester results';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const publishSubjectResults = useCallback(
    async (data: ISubjectResultsPublishRequest) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await examResultService.publishSubjectResults(data);
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Subject results published successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to publish subject results'
            : 'Failed to publish subject results';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  return {
    examResults,
    semesterResults,
    subjectResults,
    selectedExamResult,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadExamResults,
    loadExamResult,
    createExamResult,
    createExamResultBulk,
    editExamResult,
    removeExamResult,
    getExamResultById,
    loadSemesterResults,
    loadSubjectResults,
    publishSemesterResults,
    publishSubjectResults,
    clearAction,
    clearDetails,
    setSelected,
  };
};
