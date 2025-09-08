import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Status} from '@/enums';
import {RootState} from '@/store';

import {IAttendance, IAttendanceCreate, IAttendanceUpdate} from '@/types/attendance';
import {IBasePaginatedResponse} from '@/types/common';

import {attendanceService} from '@/services/attendanceService';

import {
    addAttendance,
    clearActionStatus,
    clearDetailsStatus,
    deleteAttendance,
    setActionStatus,
    setAttendances,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedAttendance,
    updateAttendance,
} from '@/store/slices/attendanceSlice';

export const useAttendances = () => {
  const dispatch = useDispatch();
  const { attendances, selectedAttendance, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.attendances);

  // Load attendances with pagination and search
  const loadAttendances = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IAttendance> =
          await attendanceService.getAttendances(params);
        dispatch(setAttendances(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load attendances'
            : 'Failed to load attendances';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single attendance
  const loadAttendance = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IAttendance = await attendanceService.getAttendance(id);
        dispatch(setSelectedAttendance(response));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load attendance'
            : 'Failed to load attendance';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new attendance
  const createAttendance = useCallback(
    async (data: IAttendanceCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IAttendance = await attendanceService.createAttendance(data);
        dispatch(addAttendance(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Attendance created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create attendance'
            : 'Failed to create attendance';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing attendance
  const editAttendance = useCallback(
    async (id: number, data: IAttendanceUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IAttendance = await attendanceService.updateAttendance(id, data);
        dispatch(updateAttendance(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Attendance updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update attendance'
            : 'Failed to update attendance';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Delete an attendance
  const removeAttendance = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await attendanceService.deleteAttendance(id);
        dispatch(deleteAttendance(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Attendance deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete attendance'
            : 'Failed to delete attendance';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
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

  // Set selected attendance
  const setSelected = useCallback(
    (attendance: IAttendance | null) => {
      dispatch(setSelectedAttendance(attendance));
    },
    [dispatch],
  );

  // Get attendance by ID
  const getAttendanceById = useCallback(
    (id: number) => {
      if (selectedAttendance && selectedAttendance.id === id) {
        return;
      }

      const attendance = attendances.find((attendance: IAttendance) => attendance.id === id);
      if (attendance) {
        dispatch(setSelectedAttendance(attendance));
      } else {
        loadAttendance(id);
      }
    },
    [attendances, selectedAttendance, dispatch, setSelectedAttendance, loadAttendance],
  );

  return {
    attendances,
    selectedAttendance,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
    loadAttendances,
    loadAttendance,
    createAttendance,
    editAttendance,
    removeAttendance,
    getAttendanceById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
