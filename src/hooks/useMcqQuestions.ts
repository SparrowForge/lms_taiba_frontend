import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IMCQQuestion,
  IMCQQuestionBulkCreate,
  IMCQQuestionCreate,
  IMCQQuestionUpdate,
} from '@/types/mcqQuestion';

import { mcqQuestionService } from '@/services/mcqQuestionService';

import {
  addBulkMcqQuestions,
  addMcqQuestion,
  clearActionStatus,
  clearDetailsStatus,
  deleteMcqQuestion,
  setActionStatus,
  setDetailsStatus,
  setListStatus,
  setMcqQuestions,
  setPagination,
  setSelectedMcqQuestion,
  updateMcqQuestion,
} from '@/store/slices/mcqQuestionSlice';

export const useMcqQuestions = () => {
  const dispatch = useDispatch();
  const { mcqQuestions, selectedMcqQuestion, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.mcqQuestions);

  // Load MCQ questions with pagination and search
  const loadMcqQuestions = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IMCQQuestion> =
          await mcqQuestionService.getMcqQuestions(params);
        dispatch(setMcqQuestions(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load MCQ questions'
            : 'Failed to load MCQ questions';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single MCQ question
  const loadMcqQuestion = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IMCQQuestion> = await mcqQuestionService.getMcqQuestion(id);
        dispatch(setSelectedMcqQuestion(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load MCQ question'
            : 'Failed to load MCQ question';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new MCQ question
  const createMcqQuestion = useCallback(
    async (data: IMCQQuestionCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IMCQQuestion = await mcqQuestionService.createMcqQuestion(data);
        dispatch(addMcqQuestion(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'MCQ question created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create MCQ question'
            : 'Failed to create MCQ question';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Create multiple MCQ questions
  const createBulkMcqQuestions = useCallback(
    async (data: IMCQQuestionBulkCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IMCQQuestion[] = await mcqQuestionService.createBulkMcqQuestions(data);
        dispatch(addBulkMcqQuestions(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: `${response.length} MCQ question(s) created successfully`,
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create MCQ questions'
            : 'Failed to create MCQ questions';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing MCQ question
  const editMcqQuestion = useCallback(
    async (id: number, data: IMCQQuestionUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IMCQQuestion = await mcqQuestionService.updateMcqQuestion(id, data);
        dispatch(updateMcqQuestion(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'MCQ question updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update MCQ question'
            : 'Failed to update MCQ question';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove an MCQ question
  const removeMcqQuestion = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await mcqQuestionService.deleteMcqQuestion(id);
        dispatch(deleteMcqQuestion(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'MCQ question deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete MCQ question'
            : 'Failed to delete MCQ question';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get MCQ question by ID from the current list
  const getMcqQuestionById = useCallback(
    (id: number) => {
      if (selectedMcqQuestion && selectedMcqQuestion.id === id) {
        return;
      }

      const mcqQuestion = mcqQuestions.find((mcqQuestion) => mcqQuestion.id === id);
      if (mcqQuestion) {
        dispatch(setSelectedMcqQuestion(mcqQuestion));
      } else {
        loadMcqQuestion(id);
      }
    },
    [mcqQuestions, selectedMcqQuestion, dispatch, loadMcqQuestion],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected MCQ question
  const setSelected = useCallback(
    (mcqQuestion: IMCQQuestion | null) => {
      dispatch(setSelectedMcqQuestion(mcqQuestion));
    },
    [dispatch],
  );

  return {
    // State
    mcqQuestions,
    selectedMcqQuestion,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadMcqQuestions,
    loadMcqQuestion,
    createMcqQuestion,
    createBulkMcqQuestions,
    editMcqQuestion,
    removeMcqQuestion,
    getMcqQuestionById,
    clearAction,
    clearDetails,
    setSelected,
  };
};

