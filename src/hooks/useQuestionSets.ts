import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IQuestionSet,
  IQuestionSetCreate,
  IQuestionSetUpdate,
  IQuestionSetWithQuestionsCreate,
} from '@/types/questionSet';

import { questionSetService } from '@/services/questionSetService';

import {
  addQuestionSet,
  clearActionStatus,
  clearDetailsStatus,
  deleteQuestionSet,
  setActionStatus,
  setDetailsStatus,
  setListStatus,
  setPagination,
  setQuestionSets,
  setSelectedQuestionSet,
  updateQuestionSet,
} from '@/store/slices/questionSetSlice';

export const useQuestionSets = () => {
  const dispatch = useDispatch();
  const {
    questionSets,
    selectedQuestionSet,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.questionSets);

  // Load question sets with pagination and search
  const loadQuestionSets = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IQuestionSet> =
          await questionSetService.getQuestionSets(params);
        dispatch(setQuestionSets(response?.data?.items ?? []));
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
              'Failed to load question sets'
            : 'Failed to load question sets';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single question set
  const loadQuestionSet = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IQuestionSet> = await questionSetService.getQuestionSet(id);
        dispatch(setSelectedQuestionSet(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load question set'
            : 'Failed to load question set';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new question set
  const createQuestionSet = useCallback(
    async (data: IQuestionSetCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IQuestionSet = await questionSetService.createQuestionSet(data);
        dispatch(addQuestionSet(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Question set created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create question set'
            : 'Failed to create question set';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Create a question set with questions
  const createQuestionSetWithQuestions = useCallback(
    async (data: IQuestionSetWithQuestionsCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IQuestionSet = await questionSetService.createQuestionSetWithQuestions(data);
        dispatch(addQuestionSet(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Question set with questions created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create question set with questions'
            : 'Failed to create question set with questions';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing question set
  const editQuestionSet = useCallback(
    async (id: number, data: IQuestionSetUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IQuestionSet = await questionSetService.updateQuestionSet(id, data);
        dispatch(updateQuestionSet(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Question set updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update question set'
            : 'Failed to update question set';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a question set
  const removeQuestionSet = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await questionSetService.deleteQuestionSet(id);
        dispatch(deleteQuestionSet(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Question set deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete question set'
            : 'Failed to delete question set';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get question set by ID from the current list
  const getQuestionSetById = useCallback(
    (id: number) => {
      if (selectedQuestionSet && selectedQuestionSet.id === id) {
        return;
      }

      const questionSet = questionSets.find((questionSet) => questionSet.id === id);
      if (questionSet) {
        dispatch(setSelectedQuestionSet(questionSet));
      } else {
        loadQuestionSet(id);
      }
    },
    [questionSets, selectedQuestionSet, dispatch, loadQuestionSet],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected question set
  const setSelected = useCallback(
    (questionSet: IQuestionSet | null) => {
      dispatch(setSelectedQuestionSet(questionSet));
    },
    [dispatch],
  );

  return {
    // State
    questionSets,
    selectedQuestionSet,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadQuestionSets,
    loadQuestionSet,
    createQuestionSet,
    createQuestionSetWithQuestions,
    editQuestionSet,
    removeQuestionSet,
    getQuestionSetById,
    clearAction,
    clearDetails,
    setSelected,
  };
};

