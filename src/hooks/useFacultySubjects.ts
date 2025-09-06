import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Status} from '@/enums';
import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IFacultySubject, IFacultySubjectCreate, IFacultySubjectUpdate,} from '@/types/facultySubject';

import {facultySubjectService} from '@/services/facultySubjectService';

import {
    addFacultySubject,
    clearActionStatus,
    clearDetailsStatus,
    deleteFacultySubject,
    setActionStatus,
    setDetailsStatus,
    setFacultySubjects,
    setListStatus,
    setPagination,
    setSelectedFacultySubject,
    updateFacultySubject,
} from '@/store/slices/facultySubjectSlice';

export const useFacultySubjects = () => {
  const dispatch = useDispatch();
  const {
    facultySubjects,
    selectedFacultySubject,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.facultySubjects);

  // Load faculty subjects with pagination and search
  const loadFacultySubjects = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IFacultySubject> =
          await facultySubjectService.getFacultySubjects(params);
        dispatch(setFacultySubjects(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load faculty subjects'
            : 'Failed to load faculty subjects';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single faculty subject
  const loadFacultySubject = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IFacultySubject> =
          await facultySubjectService.getFacultySubject(id);
        dispatch(setSelectedFacultySubject(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load faculty subject'
            : 'Failed to load faculty subject';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new faculty subject
  const createFacultySubject = useCallback(
    async (data: IFacultySubjectCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IFacultySubject = await facultySubjectService.createFacultySubject(data);
        dispatch(addFacultySubject(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Faculty subject created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create faculty subject'
            : 'Failed to create faculty subject';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing faculty subject
  const editFacultySubject = useCallback(
    async (id: number, data: IFacultySubjectUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IFacultySubject = await facultySubjectService.updateFacultySubject(
          id,
          data,
        );
        dispatch(updateFacultySubject(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Faculty subject updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update faculty subject'
            : 'Failed to update faculty subject';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a faculty subject
  const removeFacultySubject = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await facultySubjectService.deleteFacultySubject(id);
        dispatch(deleteFacultySubject(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Faculty subject deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete faculty subject'
            : 'Failed to delete faculty subject';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get faculty subject by ID from the current list
  const getFacultySubjectById = useCallback(
    (id: number) => {
      if (selectedFacultySubject && selectedFacultySubject.id === id) {
        return;
      }

      const facultySubject = facultySubjects.find((facultySubject) => facultySubject.id === id);
      if (facultySubject) {
        dispatch(setSelectedFacultySubject(facultySubject));
      } else {
        loadFacultySubject(id);
      }
    },
    [facultySubjects, selectedFacultySubject, dispatch, loadFacultySubject],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected faculty subject
  const setSelected = useCallback(
    (facultySubject: IFacultySubject | null) => {
      dispatch(setSelectedFacultySubject(facultySubject));
    },
    [dispatch],
  );

  return {
    // State
    facultySubjects,
    selectedFacultySubject,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadFacultySubjects,
    loadFacultySubject,
    createFacultySubject,
    editFacultySubject,
    removeFacultySubject,
    getFacultySubjectById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
