import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Status} from '@/enums';
import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {ICourse, ICourseCreate, ICourseUpdate} from '@/types/course';

import {courseService} from '@/services/courseService';

import {
    addCourse,
    clearActionStatus,
    clearDetailsStatus,
    deleteCourse,
    setActionStatus,
    setCourses,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedCourse,
    updateCourse,
} from '@/store/slices/courseSlice';

export const useCourses = () => {
  const dispatch = useDispatch();
  const { courses, selectedCourse, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.courses);

  // Load courses with pagination and search
  const loadCourses = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<ICourse> = await courseService.getCourses(params);
        dispatch(setCourses(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load courses'
            : 'Failed to load courses';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single course
  const loadCourse = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<ICourse> = await courseService.getCourse(id);
        dispatch(setSelectedCourse(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load course'
            : 'Failed to load course';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new course
  const createCourse = useCallback(
    async (data: ICourseCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ICourse = await courseService.createCourse(data);
        dispatch(addCourse(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Course created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create course'
            : 'Failed to create course';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing course
  const editCourse = useCallback(
    async (id: number, data: ICourseUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ICourse = await courseService.updateCourse(id, data);
        dispatch(updateCourse(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Course updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update course'
            : 'Failed to update course';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a course
  const removeCourse = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await courseService.deleteCourse(id);
        dispatch(deleteCourse(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Course deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete course'
            : 'Failed to delete course';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get course by ID from the current list
  const getCourseById = useCallback(
    (id: number) => {
      if (selectedCourse && selectedCourse.id === id) {
        return;
      }

      const course = courses.find((course) => course.id === id);
      if (course) {
        dispatch(setSelectedCourse(course));
      } else {
        loadCourse(id);
      }
    },
    [courses, selectedCourse, dispatch, loadCourse],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected course
  const setSelected = useCallback(
    (course: ICourse | null) => {
      dispatch(setSelectedCourse(course));
    },
    [dispatch],
  );

  return {
    // State
    courses,
    selectedCourse,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadCourses,
    loadCourse,
    createCourse,
    editCourse,
    removeCourse,
    getCourseById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
