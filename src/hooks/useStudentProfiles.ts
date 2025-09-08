import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IStudentProfile,
  IStudentProfileCreate,
  IStudentProfileUpdate,
} from '@/types/studentProfile';

import { studentProfileService } from '@/services/studentProfileService';

import {
  addStudentProfile,
  clearActionStatus,
  clearDetailsStatus,
  deleteStudentProfile,
  setActionStatus,
  setDetailsStatus,
  setListStatus,
  setPagination,
  setSelectedStudentProfile,
  setStudentProfiles,
  updateStudentProfile,
} from '@/store/slices/studentProfileSlice';

export const useStudentProfiles = () => {
  const dispatch = useDispatch();
  const {
    studentProfiles,
    selectedStudentProfile,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.studentProfiles);

  const loadStudentProfiles = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IStudentProfile> =
          await studentProfileService.getStudentProfiles(params);
        dispatch(setStudentProfiles(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load student profiles'
            : 'Failed to load student profiles';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadStudentProfile = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IStudentProfile> =
          await studentProfileService.getStudentProfile(id);
        dispatch(setSelectedStudentProfile(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load student profile'
            : 'Failed to load student profile';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createStudentProfile = useCallback(
    async (data: IStudentProfileCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IStudentProfile = await studentProfileService.createStudentProfile(data);
        dispatch(addStudentProfile(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Student profile created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create student profile'
            : 'Failed to create student profile';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editStudentProfile = useCallback(
    async (id: number, data: IStudentProfileUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IStudentProfile = await studentProfileService.updateStudentProfile(
          id,
          data,
        );
        dispatch(updateStudentProfile(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Student profile updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update student profile'
            : 'Failed to update student profile';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeStudentProfile = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await studentProfileService.deleteStudentProfile(id);
        dispatch(deleteStudentProfile(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Student profile deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete student profile'
            : 'Failed to delete student profile';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getStudentProfileById = useCallback(
    (id: number) => {
      if (selectedStudentProfile && selectedStudentProfile.id === id) {
        return;
      }

      const studentProfile = studentProfiles.find((studentProfile) => studentProfile.id === id);
      if (studentProfile) {
        dispatch(setSelectedStudentProfile(studentProfile));
      } else {
        loadStudentProfile(id);
      }
    },
    [studentProfiles, selectedStudentProfile, dispatch, loadStudentProfile],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (studentProfile: IStudentProfile | null) => {
      dispatch(setSelectedStudentProfile(studentProfile));
    },
    [dispatch],
  );

  return {
    studentProfiles,
    selectedStudentProfile,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadStudentProfiles,
    loadStudentProfile,
    createStudentProfile,
    editStudentProfile,
    removeStudentProfile,
    getStudentProfileById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
