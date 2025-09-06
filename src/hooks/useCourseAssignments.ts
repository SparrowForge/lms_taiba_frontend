import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IBasePaginatedResponse, Status} from '@/types/common';
import {ICourseAssignment, ICourseAssignmentCreate, ICourseAssignmentUpdate,} from '@/types/courseAssignment';

import {courseAssignmentService} from '@/services/courseAssignmentService';

import {
    addCourseAssignment,
    clearActionStatus,
    clearDetailsStatus,
    deleteCourseAssignment,
    setActionStatus,
    setCourseAssignments,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedCourseAssignment,
    updateCourseAssignment,
} from '@/store/slices/courseAssignmentSlice';

export const useCourseAssignments = () => {
  const dispatch = useDispatch();
  const {
    courseAssignments,
    selectedCourseAssignment,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.courseAssignments);

  // Load course assignments with pagination and search
  const loadCourseAssignments = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<ICourseAssignment> =
          await courseAssignmentService.getCourseAssignments(params);
        dispatch(setCourseAssignments(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load course assignments'
            : 'Failed to load course assignments';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single course assignment
  const loadCourseAssignment = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: ICourseAssignment = await courseAssignmentService.getCourseAssignment(id);
        dispatch(setSelectedCourseAssignment(response));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load course assignment'
            : 'Failed to load course assignment';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new course assignment
  const createCourseAssignment = useCallback(
    async (data: ICourseAssignmentCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ICourseAssignment =
          await courseAssignmentService.createCourseAssignment(data);
        dispatch(addCourseAssignment(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Course assignment created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create course assignment'
            : 'Failed to create course assignment';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing course assignment
  const editCourseAssignment = useCallback(
    async (id: number, data: ICourseAssignmentUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ICourseAssignment = await courseAssignmentService.updateCourseAssignment(
          id,
          data,
        );
        dispatch(updateCourseAssignment(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Course assignment updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update course assignment'
            : 'Failed to update course assignment';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Delete a course assignment
  const removeCourseAssignment = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await courseAssignmentService.deleteCourseAssignment(id);
        dispatch(deleteCourseAssignment(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Course assignment deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete course assignment'
            : 'Failed to delete course assignment';
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

  // Set selected course assignment
  const setSelected = useCallback(
    (courseAssignment: ICourseAssignment | null) => {
      dispatch(setSelectedCourseAssignment(courseAssignment));
    },
    [dispatch],
  );

  // Get course assignment by ID
  const getCourseAssignmentById = useCallback(
    (id: number) => {
      if (selectedCourseAssignment && selectedCourseAssignment.id === id) {
        return;
      }

      const courseAssignment = courseAssignments.find((ca: ICourseAssignment) => ca.id === id);
      if (courseAssignment) {
        dispatch(setSelectedCourseAssignment(courseAssignment));
      } else {
        loadCourseAssignment(id);
      }
    },
    [
      courseAssignments,
      selectedCourseAssignment,
      dispatch,
      setSelectedCourseAssignment,
      loadCourseAssignment,
    ],
  );

  return {
    courseAssignments,
    selectedCourseAssignment,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
    loadCourseAssignments,
    loadCourseAssignment,
    createCourseAssignment,
    editCourseAssignment,
    removeCourseAssignment,
    getCourseAssignmentById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
