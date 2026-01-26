'use client';

import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  ISubjectExamResult,
  IPublishSubjectResultRequest,
} from '@/types/subjectResult';



import { subjectResultService } from '@/services/subjectresultService';

import {
  clearActionStatus,
  clearDetailsStatus,
  setActionStatus,
  setDetailsStatus,
  setListStatus,
  setPagination,
  setSelectedSubjectResult,
  setSubjectResults,
} from '@/store/slices/subjectResultSlice';

export const useSubjectResults = () => {
  const dispatch = useDispatch();
  const {
    subjectResults,
    selectedSubjectResult,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.subjectResults);

  const loadSubjectResults = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<ISubjectExamResult> =
          await subjectResultService.getSubjectResults(params);
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
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load subject results'
            : 'Failed to load subject results';
        dispatch(
          setListStatus({ status: Status.FAILED, message: errorMessage }),
        );
      }
    },
    [dispatch],
  );

  const loadSubjectResult = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<ISubjectExamResult> =
          await subjectResultService.getSubjectResult(id);
        dispatch(setSelectedSubjectResult(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load subject result'
            : 'Failed to load subject result';
        dispatch(
          setDetailsStatus({ status: Status.FAILED, message: errorMessage }),
        );
      }
    },
    [dispatch],
  );

  const publishSubjectResults = useCallback(
    async (data: IPublishSubjectResultRequest) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response =
          await subjectResultService.publishSubjectResults(data);
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message:
              response.message ||
              'Subject results published successfully',
          }),
        );
        await loadSubjectResults();
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to publish subject results'
            : 'Failed to publish subject results';
        dispatch(
          setActionStatus({ status: Status.FAILED, message: errorMessage }),
        );
        throw error;
      }
    },
    [dispatch, loadSubjectResults],
  );

  const getSubjectResultById = useCallback(
    (id: number) => {
      if (selectedSubjectResult && selectedSubjectResult.id === id) {
        return;
      }

      const result = subjectResults.find((result) => result.id === id);
      if (result) {
        dispatch(setSelectedSubjectResult(result));
      } else {
        loadSubjectResult(id);
      }
    },
    [subjectResults, selectedSubjectResult, dispatch, loadSubjectResult],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (result: ISubjectExamResult | null) => {
      dispatch(setSelectedSubjectResult(result));
    },
    [dispatch],
  );

  return {
    subjectResults,
    selectedSubjectResult,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadSubjectResults,
    loadSubjectResult,
    publishSubjectResults,
    getSubjectResultById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
