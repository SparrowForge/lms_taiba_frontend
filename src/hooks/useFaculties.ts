import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Status} from '@/enums';
import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IFaculty, IFacultyCreate, IFacultyUpdate} from '@/types/faculty';

import {facultyService} from '@/services/facultyService';

import {
    addFaculty,
    clearActionStatus,
    clearDetailsStatus,
    deleteFaculty,
    setActionStatus,
    setDetailsStatus,
    setFaculties,
    setListStatus,
    setPagination,
    setSelectedFaculty,
    updateFaculty,
} from '@/store/slices/facultySlice';

export const useFaculties = () => {
  const dispatch = useDispatch();
  const { faculties, selectedFaculty, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.faculties);

  // Load faculties with pagination and search
  const loadFaculties = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IFaculty> =
          await facultyService.getFaculties(params);
        dispatch(setFaculties(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load faculties'
            : 'Failed to load faculties';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single faculty
  const loadFaculty = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IFaculty> = await facultyService.getFaculty(id);
        dispatch(setSelectedFaculty(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load faculty'
            : 'Failed to load faculty';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new faculty
  const createFaculty = useCallback(
    async (data: IFacultyCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IFaculty = await facultyService.createFaculty(data);
        dispatch(addFaculty(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Faculty created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create faculty'
            : 'Failed to create faculty';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing faculty
  const editFaculty = useCallback(
    async (id: number, data: IFacultyUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IFaculty = await facultyService.updateFaculty(id, data);
        dispatch(updateFaculty(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Faculty updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update faculty'
            : 'Failed to update faculty';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a faculty
  const removeFaculty = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await facultyService.deleteFaculty(id);
        dispatch(deleteFaculty(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Faculty deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete faculty'
            : 'Failed to delete faculty';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get faculty by ID from the current list
  const getFacultyById = useCallback(
    (id: number) => {
      if (selectedFaculty && selectedFaculty.id === id) {
        return;
      }

      const faculty = faculties.find((faculty) => faculty.id === id);
      if (faculty) {
        dispatch(setSelectedFaculty(faculty));
      } else {
        loadFaculty(id);
      }
    },
    [faculties, selectedFaculty, dispatch, loadFaculty],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected faculty
  const setSelected = useCallback(
    (faculty: IFaculty | null) => {
      dispatch(setSelectedFaculty(faculty));
    },
    [dispatch],
  );

  return {
    // State
    faculties,
    selectedFaculty,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadFaculties,
    loadFaculty,
    createFaculty,
    editFaculty,
    removeFaculty,
    getFacultyById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
