import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IExamQuestion,
  IExamQuestionBulkCreate,
  IExamQuestionCreate,
  IExamQuestionMultipleCreate,
  IExamQuestionUpdate,
} from '@/types/examQuestion';

import { examQuestionService } from '@/services/examQuestionService';

import {
  addExamQuestion,
  addExamQuestionMultiple,
  addExamQuestionsBulk,
  clearActionStatus,
  clearDetailsStatus,
  deleteExamQuestion,
  setActionStatus,
  setDetailsStatus,
  setExamQuestions,
  setListStatus,
  setPagination,
  setSelectedExamQuestion,
  updateExamQuestion,
} from '@/store/slices/examQuestionSlice';

export const useExamQuestions = () => {
  const dispatch = useDispatch();
  const {
    examQuestions,
    selectedExamQuestion,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.examQuestions);

  const loadExamQuestions = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IExamQuestion> =
          await examQuestionService.getExamQuestions(params);
        dispatch(setExamQuestions(response?.data?.items ?? []));
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
              'Failed to load exam questions'
            : 'Failed to load exam questions';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadExamQuestion = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IExamQuestion> =
          await examQuestionService.getExamQuestion(id);
        dispatch(setSelectedExamQuestion(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load exam question'
            : 'Failed to load exam question';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createExamQuestion = useCallback(
    async (data: IExamQuestionCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IExamQuestion = await examQuestionService.createExamQuestion(data);
        dispatch(addExamQuestion(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Exam question created successfully',
          }),
        );
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create exam question'
            : 'Failed to create exam question';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const createMultipleExamQuestion = useCallback(
    async (data: IExamQuestionBulkCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await examQuestionService.createMultipleExamQuestion(data);
        dispatch(addExamQuestionsBulk(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Exam questions created successfully',
          }),
        );
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create exam questions'
            : 'Failed to create exam questions';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editExamQuestion = useCallback(
    async (id: number, data: IExamQuestionUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IExamQuestion = await examQuestionService.updateExamQuestion(id, data);
        dispatch(updateExamQuestion(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Exam question updated successfully',
          }),
        );
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update exam question'
            : 'Failed to update exam question';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeExamQuestion = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await examQuestionService.deleteExamQuestion(id);
        dispatch(deleteExamQuestion(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Exam question deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete exam question'
            : 'Failed to delete exam question';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getExamQuestionById = useCallback(
    (id: number) => {
      if (selectedExamQuestion && selectedExamQuestion.id === id) {
        return;
      }
      const question = examQuestions.find((q) => q.id === id);
      if (question) {
        dispatch(setSelectedExamQuestion(question));
      } else {
        loadExamQuestion(id);
      }
    },
    [examQuestions, selectedExamQuestion, dispatch, loadExamQuestion],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (question: IExamQuestion | null) => {
      dispatch(setSelectedExamQuestion(question));
    },
    [dispatch],
  );

  return {
    examQuestions,
    selectedExamQuestion,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
    loadExamQuestions,
    loadExamQuestion,
    createExamQuestion,
    createMultipleExamQuestion,
    editExamQuestion,
    removeExamQuestion,
    getExamQuestionById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
