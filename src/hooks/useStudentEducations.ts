import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse, Status} from '@/types/common';
import {IStudentEducation, IStudentEducationCreate, IStudentEducationUpdate} from '@/types/studentEducation';

import {studentEducationService} from '@/services/studentEducationService';

import {
    addStudentEducation,
    clearActionStatus,
    clearDetailsStatus,
    deleteStudentEducation,
    setActionStatus,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedStudentEducation,
    setStudentEducations,
    updateStudentEducation,
} from '@/store/slices/studentEducationSlice';

export const useStudentEducations = () => {
  const dispatch = useDispatch();
  const { studentEducations, selectedStudentEducation, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.studentEducations);

  const loadStudentEducations = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IStudentEducation> =
          await studentEducationService.getStudentEducations(params);
        dispatch(setStudentEducations(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load student educations'
            : 'Failed to load student educations';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadStudentEducation = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IStudentEducation> = await studentEducationService.getStudentEducation(id);
        dispatch(setSelectedStudentEducation(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load student education'
            : 'Failed to load student education';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createStudentEducation = useCallback(
    async (data: IStudentEducationCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IStudentEducation = await studentEducationService.createStudentEducation(data);
        dispatch(addStudentEducation(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Student education created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create student education'
            : 'Failed to create student education';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editStudentEducation = useCallback(
    async (id: number, data: IStudentEducationUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IStudentEducation = await studentEducationService.updateStudentEducation(id, data);
        dispatch(updateStudentEducation(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Student education updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update student education'
            : 'Failed to update student education';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeStudentEducation = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await studentEducationService.deleteStudentEducation(id);
        dispatch(deleteStudentEducation(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Student education deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete student education'
            : 'Failed to delete student education';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getStudentEducationById = useCallback(
    (id: number) => {
      if (selectedStudentEducation && selectedStudentEducation.id === id) {
        return;
      }

      const studentEducation = studentEducations.find((studentEducation) => studentEducation.id === id);
      if (studentEducation) {
        dispatch(setSelectedStudentEducation(studentEducation));
      } else {
        loadStudentEducation(id);
      }
    },
    [studentEducations, selectedStudentEducation, dispatch, loadStudentEducation],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (studentEducation: IStudentEducation | null) => {
      dispatch(setSelectedStudentEducation(studentEducation));
    },
    [dispatch],
  );

  return {
    studentEducations,
    selectedStudentEducation,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadStudentEducations,
    loadStudentEducation,
    createStudentEducation,
    editStudentEducation,
    removeStudentEducation,
    getStudentEducationById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
