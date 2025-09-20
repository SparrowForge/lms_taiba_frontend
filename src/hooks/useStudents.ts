import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IStudent, IStudentCreate, IStudentUpdate } from '@/types/student';

import { studentService } from '@/services/studentService';

import {
  addStudent,
  clearActionStatus,
  clearDetailsStatus,
  deleteStudent,
  setActionStatus,
  setDetailsStatus,
  setListStatus,
  setPagination,
  setSelectedStudent,
  setStudents,
  updateStudent,
} from '@/store/slices/studentSlice';

export const useStudents = () => {
  const dispatch = useDispatch();
  const { students, selectedStudent, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.students);

  const loadStudents = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IStudent> = await studentService.getStudents(params);
        dispatch(setStudents(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load students'
            : 'Failed to load students';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadStudent = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IStudent> = await studentService.getStudent(id);
        dispatch(setSelectedStudent(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load student'
            : 'Failed to load student';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createStudent = useCallback(
    async (data: IStudentCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IStudent = await studentService.createStudent(data);
        dispatch(addStudent(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Student created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create student'
            : 'Failed to create student';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editStudent = useCallback(
    async (id: number, data: IStudentUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IStudent = await studentService.updateStudent(id, data);
        dispatch(updateStudent(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Student updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update student'
            : 'Failed to update student';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeStudent = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await studentService.deleteStudent(id);
        dispatch(deleteStudent(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Student deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete student'
            : 'Failed to delete student';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getStudentById = useCallback(
    (id: number) => {
      if (selectedStudent && selectedStudent.id === id) {
        return;
      }

      const student = students.find((student) => student.id === id);
      if (student) {
        dispatch(setSelectedStudent(student));
      } else {
        loadStudent(id);
      }
    },
    [students, selectedStudent, dispatch, loadStudent],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (student: IStudent | null) => {
      dispatch(setSelectedStudent(student));
    },
    [dispatch],
  );

  // Load students without user accounts
  const loadStudentsWithoutUser = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IStudent[]> =
          await studentService.getStudentsWithoutUser(params);
        dispatch(setStudents(response?.data ?? []));
        // Reset pagination since this is not a paginated response
        dispatch(
          setPagination({
            page: 1,
            limit: response?.data?.length ?? 0,
            total: response?.data?.length ?? 0,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          }),
        );
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load students without user accounts'
            : 'Failed to load students without user accounts';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  return {
    students,
    selectedStudent,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadStudents,
    loadStudentsWithoutUser,
    loadStudent,
    createStudent,
    editStudent,
    removeStudent,
    getStudentById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
