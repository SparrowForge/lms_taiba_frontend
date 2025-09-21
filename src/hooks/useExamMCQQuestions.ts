import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IExamMCQQuestion,
  IExamMCQQuestionCreate,
  IExamMCQQuestionUpdate,
} from '@/types/examMCQQuestion';

import { examMCQQuestionService } from '@/services/examMCQQuestionService';

import {
  addExamMCQQuestion,
  clearActionStatus,
  clearDetailsStatus,
  deleteExamMCQQuestion,
  setActionStatus,
  setDetailsStatus,
  setExamMCQQuestions,
  setListStatus,
  setPagination,
  setSelectedExamMCQQuestion,
  updateExamMCQQuestion,
} from '@/store/slices/examMCQQuestionSlice';

export const useExamMCQQuestions = () => {
  const dispatch = useDispatch();
  const {
    examMCQQuestions,
    selectedExamMCQQuestion,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.examMCQQuestions);

  const loadExamMCQQuestions = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IExamMCQQuestion> =
          await examMCQQuestionService.getExamMCQQuestions(params);
        dispatch(setExamMCQQuestions(response?.data?.items ?? []));
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
              'Failed to load exam MCQ questions'
            : 'Failed to load exam MCQ questions';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadExamMCQQuestion = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IExamMCQQuestion> =
          await examMCQQuestionService.getExamMCQQuestion(id);
        dispatch(setSelectedExamMCQQuestion(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load exam MCQ question'
            : 'Failed to load exam MCQ question';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createExamMCQQuestion = useCallback(
    async (data: IExamMCQQuestionCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IExamMCQQuestion = await examMCQQuestionService.createExamMCQQuestion(data);
        dispatch(addExamMCQQuestion(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Exam MCQ question created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create exam MCQ question'
            : 'Failed to create exam MCQ question';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editExamMCQQuestion = useCallback(
    async (id: number, data: IExamMCQQuestionUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IExamMCQQuestion = await examMCQQuestionService.updateExamMCQQuestion(
          id,
          data,
        );
        dispatch(updateExamMCQQuestion(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Exam MCQ question updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update exam MCQ question'
            : 'Failed to update exam MCQ question';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeExamMCQQuestion = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await examMCQQuestionService.deleteExamMCQQuestion(id);
        dispatch(deleteExamMCQQuestion(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Exam MCQ question deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete exam MCQ question'
            : 'Failed to delete exam MCQ question';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getExamMCQQuestionById = useCallback(
    (id: number) => {
      if (selectedExamMCQQuestion && selectedExamMCQQuestion.id === id) {
        return;
      }

      const examMCQQuestion = examMCQQuestions.find((examMCQQuestion) => examMCQQuestion.id === id);
      if (examMCQQuestion) {
        dispatch(setSelectedExamMCQQuestion(examMCQQuestion));
      } else {
        loadExamMCQQuestion(id);
      }
    },
    [examMCQQuestions, selectedExamMCQQuestion, dispatch, loadExamMCQQuestion],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (examMCQQuestion: IExamMCQQuestion | null) => {
      dispatch(setSelectedExamMCQQuestion(examMCQQuestion));
    },
    [dispatch],
  );

  return {
    examMCQQuestions,
    selectedExamMCQQuestion,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadExamMCQQuestions,
    loadExamMCQQuestion,
    createExamMCQQuestion,
    editExamMCQQuestion,
    removeExamMCQQuestion,
    getExamMCQQuestionById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
