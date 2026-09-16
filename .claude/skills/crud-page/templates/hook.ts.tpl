import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  I__PascalSingular__,
  I__PascalSingular__Create,
  I__PascalSingular__Update,
} from '@/types/__camelSingular__';

import { __camelSingular__Service } from '@/services/__camelSingular__Service';

import {
  add__PascalSingular__,
  clearActionStatus,
  clearDetailsStatus,
  delete__PascalSingular__,
  setActionStatus,
  setDetailsStatus,
  setListStatus,
  setPagination,
  set__PascalPlural__,
  setSelected__PascalSingular__,
  update__PascalSingular__,
} from '@/store/slices/__camelSingular__Slice';

export const use__PascalPlural__ = () => {
  const dispatch = useDispatch();
  const {
    __camelPlural__,
    selected__PascalSingular__,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.__camelPlural__);

  const load__PascalPlural__ = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<I__PascalSingular__> =
          await __camelSingular__Service.get__PascalPlural__(params);
        dispatch(set__PascalPlural__(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load __lowerPlural__'
            : 'Failed to load __lowerPlural__';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const load__PascalSingular__ = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<I__PascalSingular__> =
          await __camelSingular__Service.get__PascalSingular__(id);
        dispatch(setSelected__PascalSingular__(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load __lowerSingular__'
            : 'Failed to load __lowerSingular__';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const create__PascalSingular__ = useCallback(
    async (data: I__PascalSingular__Create) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: I__PascalSingular__ =
          await __camelSingular__Service.create__PascalSingular__(data);
        dispatch(add__PascalSingular__(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: '__TitleSingular__ created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create __lowerSingular__'
            : 'Failed to create __lowerSingular__';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const edit__PascalSingular__ = useCallback(
    async (id: number, data: I__PascalSingular__Update) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: I__PascalSingular__ =
          await __camelSingular__Service.update__PascalSingular__(id, data);
        dispatch(update__PascalSingular__(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: '__TitleSingular__ updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update __lowerSingular__'
            : 'Failed to update __lowerSingular__';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const remove__PascalSingular__ = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await __camelSingular__Service.delete__PascalSingular__(id);
        dispatch(delete__PascalSingular__(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: '__TitleSingular__ deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete __lowerSingular__'
            : 'Failed to delete __lowerSingular__';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const get__PascalSingular__ById = useCallback(
    (id: number) => {
      if (selected__PascalSingular__ && selected__PascalSingular__.id === id) {
        return;
      }

      const __camelSingular__ = __camelPlural__.find((item) => item.id === id);
      if (__camelSingular__) {
        dispatch(setSelected__PascalSingular__(__camelSingular__));
      } else {
        load__PascalSingular__(id);
      }
    },
    [__camelPlural__, selected__PascalSingular__, dispatch, load__PascalSingular__],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);
  const setSelected = useCallback(
    (item: I__PascalSingular__ | null) => {
      dispatch(setSelected__PascalSingular__(item));
    },
    [dispatch],
  );

  return {
    __camelPlural__,
    selected__PascalSingular__,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    load__PascalPlural__,
    load__PascalSingular__,
    create__PascalSingular__,
    edit__PascalSingular__,
    remove__PascalSingular__,
    get__PascalSingular__ById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
