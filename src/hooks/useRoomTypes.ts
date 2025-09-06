import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Status} from '@/enums';
import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IRoomType, IRoomTypeCreate, IRoomTypeUpdate} from '@/types/roomType';

import {roomTypeService} from '@/services/roomTypeService';

import {
    addRoomType,
    clearActionStatus,
    clearDetailsStatus,
    deleteRoomType,
    setActionStatus,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setRoomTypes,
    setSelectedRoomType,
    updateRoomType,
} from '@/store/slices/roomTypeSlice';

export const useRoomTypes = () => {
  const dispatch = useDispatch();
  const { roomTypes, selectedRoomType, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.roomTypes);

  const loadRoomTypes = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IRoomType> =
          await roomTypeService.getRoomTypes(params);
        dispatch(setRoomTypes(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load room types'
            : 'Failed to load room types';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadRoomType = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IRoomType> = await roomTypeService.getRoomType(id);
        dispatch(setSelectedRoomType(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load room type'
            : 'Failed to load room type';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createRoomType = useCallback(
    async (data: IRoomTypeCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IRoomType = await roomTypeService.createRoomType(data);
        dispatch(addRoomType(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Room Type created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create room type'
            : 'Failed to create room type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editRoomType = useCallback(
    async (id: number, data: IRoomTypeUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IRoomType = await roomTypeService.updateRoomType(id, data);
        dispatch(updateRoomType(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Room Type updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update room type'
            : 'Failed to update room type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeRoomType = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await roomTypeService.deleteRoomType(id);
        dispatch(deleteRoomType(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Room Type deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete room type'
            : 'Failed to delete room type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getRoomTypeById = useCallback(
    (id: number) => {
      if (selectedRoomType && selectedRoomType.id === id) {
        return;
      }

      const roomType = roomTypes.find((item) => item.id === id);
      if (roomType) {
        dispatch(setSelectedRoomType(roomType));
      } else {
        loadRoomType(id);
      }
    },
    [roomTypes, selectedRoomType, dispatch, loadRoomType],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);
  const setSelected = useCallback(
    (item: IRoomType | null) => {
      dispatch(setSelectedRoomType(item));
    },
    [dispatch],
  );

  return {
    roomTypes,
    selectedRoomType,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadRoomTypes,
    loadRoomType,
    createRoomType,
    editRoomType,
    removeRoomType,
    getRoomTypeById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
