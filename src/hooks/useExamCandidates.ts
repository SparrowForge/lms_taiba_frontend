import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  ICreateExamCandidateBulk,
  IExamCandidate,
  IExamCandidateCreate,
  IExamCandidateUpdate,
} from '@/types/examCandidate';

import { examCandidateService } from '@/services/examCandidateService';

import {
  addExamCandidate,
  clearActionStatus,
  clearDetailsStatus,
  deleteExamCandidate,
  setActionStatus,
  setDetailsStatus,
  setExamCandidates,
  setListStatus,
  setPagination,
  setSelectedExamCandidate,
  updateExamCandidate,
} from '@/store/slices/examCandidateSlice';

export const useExamCandidates = () => {
  const dispatch = useDispatch();
  const {
    examCandidates,
    selectedExamCandidate,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.examCandidates);

  const loadExamCandidates = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IExamCandidate> =
          await examCandidateService.getExamCandidates(params);
        dispatch(setExamCandidates(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load exam candidates'
            : 'Failed to load exam candidates';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadExamCandidate = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IExamCandidate> =
          await examCandidateService.getExamCandidate(id);
        dispatch(setSelectedExamCandidate(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load exam candidate'
            : 'Failed to load exam candidate';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createExamCandidate = useCallback(
    async (data: IExamCandidateCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IExamCandidate = await examCandidateService.createExamCandidate(data);
        dispatch(addExamCandidate(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Exam candidate created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create exam candidate'
            : 'Failed to create exam candidate';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const createExamCandidateBulk = useCallback(
    async (data: ICreateExamCandidateBulk) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IExamCandidate[]> =
          await examCandidateService.createExamCandidateBulk(data);

        // Add all created candidates to the store
        if (response.data) {
          response.data.forEach((candidate) => {
            dispatch(addExamCandidate(candidate));
          });
        }

        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: `${response.data?.length || 0} exam candidates created successfully`,
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create exam candidates'
            : 'Failed to create exam candidates';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editExamCandidate = useCallback(
    async (id: number, data: IExamCandidateUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IExamCandidate = await examCandidateService.updateExamCandidate(id, data);
        dispatch(updateExamCandidate(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Exam candidate updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update exam candidate'
            : 'Failed to update exam candidate';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeExamCandidate = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await examCandidateService.deleteExamCandidate(id);
        dispatch(deleteExamCandidate(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Exam candidate deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete exam candidate'
            : 'Failed to delete exam candidate';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getExamCandidateById = useCallback(
    (id: number) => {
      if (selectedExamCandidate && selectedExamCandidate.id === id) {
        return;
      }

      const examCandidate = examCandidates.find((examCandidate) => examCandidate.id === id);
      if (examCandidate) {
        dispatch(setSelectedExamCandidate(examCandidate));
      } else {
        loadExamCandidate(id);
      }
    },
    [examCandidates, selectedExamCandidate, dispatch, loadExamCandidate],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (examCandidate: IExamCandidate | null) => {
      dispatch(setSelectedExamCandidate(examCandidate));
    },
    [dispatch],
  );

  return {
    examCandidates,
    selectedExamCandidate,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadExamCandidates,
    loadExamCandidate,
    createExamCandidate,
    createExamCandidateBulk,
    editExamCandidate,
    removeExamCandidate,
    getExamCandidateById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
