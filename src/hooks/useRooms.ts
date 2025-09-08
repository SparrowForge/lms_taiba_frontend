import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Status} from '@/enums';
import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IRoom, IRoomCreate, IRoomUpdate} from '@/types/room';

import {roomService} from '@/services/roomService';

import {
    addRoom,
    clearActionStatus,
    clearDetailsStatus,
    deleteRoom,
    setActionStatus,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setRooms,
    setSelectedRoom,
    updateRoom,
} from '@/store/slices/roomSlice';

export const useRooms = () => {
  const dispatch = useDispatch();
  const { rooms, selectedRoom, listStatus, detailsStatus, actionStatus, pagination } = useSelector(
    (state: RootState) => state.rooms,
  );

  const loadRooms = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IRoom> = await roomService.getRooms(params);
        dispatch(setRooms(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load rooms'
            : 'Failed to load rooms';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadRoom = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IRoom> = await roomService.getRoom(id);
        dispatch(setSelectedRoom(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load room'
            : 'Failed to load room';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createRoom = useCallback(
    async (data: IRoomCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IRoom = await roomService.createRoom(data);
        dispatch(addRoom(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Room created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create room'
            : 'Failed to create room';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editRoom = useCallback(
    async (id: number, data: IRoomUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IRoom = await roomService.updateRoom(id, data);
        dispatch(updateRoom(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Room updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update room'
            : 'Failed to update room';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeRoom = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await roomService.deleteRoom(id);
        dispatch(deleteRoom(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Room deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete room'
            : 'Failed to delete room';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getRoomById = useCallback(
    (id: number) => {
      if (selectedRoom && selectedRoom.id === id) {
        return;
      }
      const room = rooms.find((item) => item.id === id);
      if (room) {
        dispatch(setSelectedRoom(room));
      } else {
        loadRoom(id);
      }
    },
    [rooms, selectedRoom, dispatch, loadRoom],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (item: IRoom | null) => {
      dispatch(setSelectedRoom(item));
    },
    [dispatch],
  );

  return {
    rooms,
    selectedRoom,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
    loadRooms,
    loadRoom,
    createRoom,
    editRoom,
    removeRoom,
    getRoomById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
