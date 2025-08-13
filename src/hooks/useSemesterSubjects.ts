import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse, Status} from '@/types/common';
import {ISemesterSubject, ISemesterSubjectCreate, ISemesterSubjectUpdate,} from '@/types/semesterSubject';

import {semesterSubjectService} from '@/services/semesterSubjectService';

import {
    addSemesterSubject,
    clearActionStatus,
    clearDetailsStatus,
    deleteSemesterSubject,
    setActionStatus,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedSemesterSubject,
    setSemesterSubjects,
    updateSemesterSubject,
} from '@/store/slices/semesterSubjectSlice';

export const useSemesterSubjects = () => {
  const dispatch = useDispatch();
  const {
    semesterSubjects,
    selectedSemesterSubject,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.semesterSubjects);

  // Load semester subjects with pagination and search
  const loadSemesterSubjects = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<ISemesterSubject> =
          await semesterSubjectService.getSemesterSubjects(params);
        dispatch(setSemesterSubjects(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load semester subjects'
            : 'Failed to load semester subjects';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single semester subject
  const loadSemesterSubject = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<ISemesterSubject> = await semesterSubjectService.getSemesterSubject(id);
        dispatch(setSelectedSemesterSubject(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load semester subject'
            : 'Failed to load semester subject';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new semester subject
  const createSemesterSubject = useCallback(
    async (data: ISemesterSubjectCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ISemesterSubject = await semesterSubjectService.createSemesterSubject(data);
        dispatch(addSemesterSubject(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Semester subject created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create semester subject'
            : 'Failed to create semester subject';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing semester subject
  const editSemesterSubject = useCallback(
    async (id: number, data: ISemesterSubjectUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ISemesterSubject = await semesterSubjectService.updateSemesterSubject(
          id,
          data,
        );
        dispatch(updateSemesterSubject(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Semester subject updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update semester subject'
            : 'Failed to update semester subject';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a semester subject
  const removeSemesterSubject = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await semesterSubjectService.deleteSemesterSubject(id);
        dispatch(deleteSemesterSubject(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Semester subject deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete semester subject'
            : 'Failed to delete semester subject';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get semester subject by ID from the current list
  const getSemesterSubjectById = useCallback(
    (id: number) => {
      const semesterSubject = semesterSubjects.find((semesterSubject) => semesterSubject.id === id);
      if (semesterSubject) {
        dispatch(setSelectedSemesterSubject(semesterSubject));
      } else {
        loadSemesterSubject(id);
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

  // Set selected semester subject
  const setSelected = useCallback(
    (semesterSubject: ISemesterSubject | null) => {
      dispatch(setSelectedSemesterSubject(semesterSubject));
    },
    [dispatch],
  );

  return {
    // State
    semesterSubjects,
    selectedSemesterSubject,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadSemesterSubjects,
    loadSemesterSubject,
    createSemesterSubject,
    editSemesterSubject,
    removeSemesterSubject,
    getSemesterSubjectById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
