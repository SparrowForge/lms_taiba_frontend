import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IBasePaginatedResponse, Status} from '@/types/common';
import {ISubject, ISubjectCreate, ISubjectUpdate} from '@/types/subject';

import {subjectService} from '@/services/subjectService';

import {
    addSubject,
    clearActionStatus,
    clearDetailsStatus,
    deleteSubject,
    setActionStatus,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedSubject,
    setSubjects,
    updateSubject,
} from '@/store/slices/subjectSlice';

export const useSubjects = () => {
  const dispatch = useDispatch();
  const { subjects, selectedSubject, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.subjects);

  // Load subjects with pagination and search
  const loadSubjects = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<ISubject> = await subjectService.getSubjects(params);
        dispatch(setSubjects(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load subjects'
            : 'Failed to load subjects';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single subject
  const loadSubject = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: ISubject = await subjectService.getSubject(id);
        dispatch(setSelectedSubject(response));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load subject'
            : 'Failed to load subject';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new subject
  const createSubject = useCallback(
    async (data: ISubjectCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ISubject = await subjectService.createSubject(data);
        dispatch(addSubject(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Subject created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create subject'
            : 'Failed to create subject';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing subject
  const editSubject = useCallback(
    async (id: number, data: ISubjectUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ISubject = await subjectService.updateSubject(id, data);
        dispatch(updateSubject(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Subject updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update subject'
            : 'Failed to update subject';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a subject
  const removeSubject = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await subjectService.deleteSubject(id);
        dispatch(deleteSubject(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Subject deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete subject'
            : 'Failed to delete subject';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get subject by ID from the current list
  const getSubjectById = useCallback(
    (id: number): ISubject | undefined => {
      return subjects.find((subject) => subject.id === id);
    },
    [subjects],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected subject
  const setSelected = useCallback(
    (subject: ISubject | null) => {
      dispatch(setSelectedSubject(subject));
    },
    [dispatch],
  );

  return {
    // State
    subjects,
    selectedSubject,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadSubjects,
    loadSubject,
    createSubject,
    editSubject,
    removeSubject,
    getSubjectById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
