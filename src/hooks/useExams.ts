import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IExam, IExamCreate, IExamUpdate, IExamWithQuestionSetCreate } from '@/types/exam';

import { examService } from '@/services/examService';

import {
  addExam,
  clearActionStatus,
  clearDetailsStatus,
  deleteExam,
  setActionStatus,
  setDetailsStatus,
  setExams,
  setListStatus,
  setPagination,
  setSelectedExam,
  updateExam,
} from '@/store/slices/examSlice';

export const useExams = () => {
  const dispatch = useDispatch();
  const { exams, selectedExam, listStatus, detailsStatus, actionStatus, pagination } = useSelector(
    (state: RootState) => state.exams,
  );

  const loadExams = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IExam> = await examService.getExams(params);
        dispatch(setExams(response.data?.items ?? []));
        dispatch(
          setPagination(
            response.data?.meta ?? {
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
            ? error.response?.data?.message || error.message || 'Failed to fetch exams'
            : 'Failed to fetch exams';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadExam = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IExam> = await examService.getExam(id);
        dispatch(setSelectedExam(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message || 'Failed to fetch exam'
            : 'Failed to fetch exam';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createExam = useCallback(
    async (data: IExamCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IExam> = await examService.createExam(data);
        dispatch(addExam(response.data));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response.data;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create exam'
            : 'Failed to create exam';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const createExamWithQuestionSet = useCallback(
    async (data: IExamWithQuestionSetCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IExam> = await examService.createExamWithQuestionSet(data.examId, data.questionSetId,data);
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response.data;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create exam with question set'
            : 'Failed to create exam with question set';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editExam = useCallback(
    async (id: number, data: IExamUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IExam> = await examService.updateExam(id, data);
        dispatch(updateExam(response.data));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response.data;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update exam'
            : 'Failed to update exam';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeExam = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await examService.deleteExam(id);
        dispatch(deleteExam(id));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete exam'
            : 'Failed to delete exam';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getExamById = useCallback(
    (id: number) => {
      if (selectedExam && selectedExam.id === id) {
        return;
      }

      const exam = exams.find((exam) => exam.id === id);
      if (exam) {
        dispatch(setSelectedExam(exam));
      } else {
        loadExam(id);
      }
    },
    [exams, selectedExam, dispatch, loadExam],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (exam: IExam | null) => {
      dispatch(setSelectedExam(exam));
    },
    [dispatch],
  );

  return {
    // State
    exams,
    selectedExam,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadExams,
    loadExam,
    createExam,
    createExamWithQuestionSet,
    editExam,
    removeExam,
    getExamById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
