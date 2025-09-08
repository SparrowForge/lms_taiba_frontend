import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IStudentFamily, IStudentFamilyCreate, IStudentFamilyUpdate } from '@/types/studentFamily';

import { studentFamilyService } from '@/services/studentFamilyService';

import {
  addStudentFamily,
  clearActionStatus,
  clearDetailsStatus,
  deleteStudentFamily,
  setActionStatus,
  setDetailsStatus,
  setListStatus,
  setPagination,
  setSelectedStudentFamily,
  setStudentFamilies,
  updateStudentFamily,
} from '@/store/slices/studentFamilySlice';

export const useStudentFamilies = () => {
  const dispatch = useDispatch();
  const {
    studentFamilies,
    selectedStudentFamily,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.studentFamilies);

  const loadStudentFamilies = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IStudentFamily> =
          await studentFamilyService.getStudentFamilies(params);
        dispatch(setStudentFamilies(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load student families'
            : 'Failed to load student families';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadStudentFamily = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IStudentFamily> =
          await studentFamilyService.getStudentFamily(id);
        dispatch(setSelectedStudentFamily(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load student family'
            : 'Failed to load student family';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createStudentFamily = useCallback(
    async (data: IStudentFamilyCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IStudentFamily = await studentFamilyService.createStudentFamily(data);
        dispatch(addStudentFamily(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Student family created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create student family'
            : 'Failed to create student family';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editStudentFamily = useCallback(
    async (id: number, data: IStudentFamilyUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IStudentFamily = await studentFamilyService.updateStudentFamily(id, data);
        dispatch(updateStudentFamily(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Student family updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update student family'
            : 'Failed to update student family';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeStudentFamily = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await studentFamilyService.deleteStudentFamily(id);
        dispatch(deleteStudentFamily(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Student family deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete student family'
            : 'Failed to delete student family';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getStudentFamilyById = useCallback(
    (id: number) => {
      if (selectedStudentFamily && selectedStudentFamily.id === id) {
        return;
      }

      const studentFamily = studentFamilies.find((studentFamily) => studentFamily.id === id);
      if (studentFamily) {
        dispatch(setSelectedStudentFamily(studentFamily));
      } else {
        loadStudentFamily(id);
      }
    },
    [studentFamilies, selectedStudentFamily, dispatch, loadStudentFamily],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (studentFamily: IStudentFamily | null) => {
      dispatch(setSelectedStudentFamily(studentFamily));
    },
    [dispatch],
  );

  return {
    studentFamilies,
    selectedStudentFamily,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadStudentFamilies,
    loadStudentFamily,
    createStudentFamily,
    editStudentFamily,
    removeStudentFamily,
    getStudentFamilyById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
