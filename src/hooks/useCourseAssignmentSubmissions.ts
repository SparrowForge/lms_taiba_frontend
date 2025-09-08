import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse } from '@/types/common';
import {
  ICourseAssignmentSubmission,
  ICourseAssignmentSubmissionCreate,
  ICourseAssignmentSubmissionUpdate,
} from '@/types/courseAssignmentSubmission';

import { courseAssignmentSubmissionService } from '@/services/courseAssignmentSubmissionService';

import {
  addCourseAssignmentSubmission,
  clearActionStatus,
  clearDetailsStatus,
  deleteCourseAssignmentSubmission,
  setActionStatus,
  setCourseAssignmentSubmissions,
  setDetailsStatus,
  setListStatus,
  setPagination,
  setSelectedCourseAssignmentSubmission,
  updateCourseAssignmentSubmission,
} from '@/store/slices/courseAssignmentSubmissionSlice';

export const useCourseAssignmentSubmissions = () => {
  const dispatch = useDispatch();
  const {
    courseAssignmentSubmissions,
    selectedCourseAssignmentSubmission,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.courseAssignmentSubmissions);

  // Load course assignment submissions with pagination and search
  const loadCourseAssignmentSubmissions = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<ICourseAssignmentSubmission> =
          await courseAssignmentSubmissionService.getCourseAssignmentSubmissions(params);
        dispatch(setCourseAssignmentSubmissions(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load course assignment submissions'
            : 'Failed to load course assignment submissions';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single course assignment submission
  const loadCourseAssignmentSubmission = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: ICourseAssignmentSubmission =
          await courseAssignmentSubmissionService.getCourseAssignmentSubmission(id);
        dispatch(setSelectedCourseAssignmentSubmission(response));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load course assignment submission'
            : 'Failed to load course assignment submission';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new course assignment submission
  const createCourseAssignmentSubmission = useCallback(
    async (data: ICourseAssignmentSubmissionCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ICourseAssignmentSubmission =
          await courseAssignmentSubmissionService.createCourseAssignmentSubmission(data);
        dispatch(addCourseAssignmentSubmission(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Course assignment submission created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create course assignment submission'
            : 'Failed to create course assignment submission';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing course assignment submission
  const editCourseAssignmentSubmission = useCallback(
    async (id: number, data: ICourseAssignmentSubmissionUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ICourseAssignmentSubmission =
          await courseAssignmentSubmissionService.updateCourseAssignmentSubmission(id, data);
        dispatch(updateCourseAssignmentSubmission(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Course assignment submission updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update course assignment submission'
            : 'Failed to update course assignment submission';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Delete a course assignment submission
  const removeCourseAssignmentSubmission = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await courseAssignmentSubmissionService.deleteCourseAssignmentSubmission(id);
        dispatch(deleteCourseAssignmentSubmission(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Course assignment submission deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete course assignment submission'
            : 'Failed to delete course assignment submission';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected course assignment submission
  const setSelected = useCallback(
    (courseAssignmentSubmission: ICourseAssignmentSubmission | null) => {
      dispatch(setSelectedCourseAssignmentSubmission(courseAssignmentSubmission));
    },
    [dispatch],
  );

  // Get course assignment submission by ID
  const getCourseAssignmentSubmissionById = useCallback(
    (id: number) => {
      if (selectedCourseAssignmentSubmission && selectedCourseAssignmentSubmission.id === id) {
        return;
      }

      const courseAssignmentSubmission = courseAssignmentSubmissions.find(
        (cas: ICourseAssignmentSubmission) => cas.id === id,
      );
      if (courseAssignmentSubmission) {
        dispatch(setSelectedCourseAssignmentSubmission(courseAssignmentSubmission));
      } else {
        loadCourseAssignmentSubmission(id);
      }
    },
    [
      courseAssignmentSubmissions,
      selectedCourseAssignmentSubmission,
      dispatch,
      setSelectedCourseAssignmentSubmission,
      loadCourseAssignmentSubmission,
    ],
  );

  return {
    courseAssignmentSubmissions,
    selectedCourseAssignmentSubmission,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
    loadCourseAssignmentSubmissions,
    loadCourseAssignmentSubmission,
    createCourseAssignmentSubmission,
    editCourseAssignmentSubmission,
    removeCourseAssignmentSubmission,
    getCourseAssignmentSubmissionById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
