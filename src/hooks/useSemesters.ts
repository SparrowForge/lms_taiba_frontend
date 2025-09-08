import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Status} from '@/enums';
import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {ISemester, ISemesterCreate, ISemesterUpdate, ISemesterWithSubjectsAndFaculty,} from '@/types/semester';

import {semesterService} from '@/services/semesterService';

import {
    addSemester,
    clearActionStatus,
    clearDetailsStatus,
    deleteSemester,
    setActionStatus,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedSemester,
    setSemesters,
    setSemesterWithSubjectsAndFaculty,
    updateSemester,
} from '@/store/slices/semesterSlice';

export const useSemesters = () => {
  const dispatch = useDispatch();
  const {
    semesters,
    selectedSemester,
    semesterWithSubjectsAndFaculty,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.semesters);

  // Load semesters with pagination and search
  const loadSemesters = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<ISemester> =
          await semesterService.getSemesters(params);
        dispatch(setSemesters(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load semesters'
            : 'Failed to load semesters';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single semester
  const loadSemester = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<ISemester> = await semesterService.getSemester(id);
        dispatch(setSelectedSemester(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load semester'
            : 'Failed to load semester';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load semester with subjects and faculty
  const loadSemesterWithSubjectsAndFaculty = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<ISemesterWithSubjectsAndFaculty> =
          await semesterService.getSemesterWithSubjectsAndFaculty(id);
        dispatch(setSemesterWithSubjectsAndFaculty(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load semester with subjects and faculty'
            : 'Failed to load semester with subjects and faculty';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new semester
  const createSemester = useCallback(
    async (data: ISemesterCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ISemester = await semesterService.createSemester(data);
        dispatch(addSemester(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Semester created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create semester'
            : 'Failed to create semester';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing semester
  const editSemester = useCallback(
    async (id: number, data: ISemesterUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ISemester = await semesterService.updateSemester(id, data);
        dispatch(updateSemester(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Semester updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update semester'
            : 'Failed to update semester';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a semester
  const removeSemester = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await semesterService.deleteSemester(id);
        dispatch(deleteSemester(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Semester deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete semester'
            : 'Failed to delete semester';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get semester by ID from the current list
  const getSemesterById = useCallback(
    (id: number) => {
      if (selectedSemester && selectedSemester.id === id) {
        return;
      }

      const semester = semesters.find((semester) => semester.id === id);
      if (semester) {
        dispatch(setSelectedSemester(semester));
      } else {
        loadSemester(id);
      }
    },
    [semesters, selectedSemester, dispatch, loadSemester],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected semester
  const setSelected = useCallback(
    (semester: ISemester | null) => {
      dispatch(setSelectedSemester(semester));
    },
    [dispatch],
  );

  const clearSemesters = useCallback(() => {
    dispatch(setSemesters([]));
  }, [dispatch]);

  return {
    // State
    semesters,
    selectedSemester,
    semesterWithSubjectsAndFaculty,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadSemesters,
    loadSemester,
    loadSemesterWithSubjectsAndFaculty,
    createSemester,
    editSemester,
    removeSemester,
    getSemesterById,
    clearAction,
    clearDetails,
    setSelected,
    clearSemesters,
  };
};
