import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IMarkDistribution,
  IMarkDistributionCreate,
  IMarkDistributionUpdate,
} from '@/types/markDistribution';

import { markDistributionService } from '@/services/markDistributionService';

import {
  addMarkDistribution,
  clearActionStatus,
  clearDetailsStatus,
  deleteMarkDistribution,
  setActionStatus,
  setDetailsStatus,
  setListStatus,
  setMarkDistributions,
  setPagination,
  setSelectedMarkDistribution,
  updateMarkDistribution,
} from '@/store/slices/markDistributionSlice';

export const useMarkDistributions = () => {
  const dispatch = useDispatch();
  const {
    markDistributions,
    selectedMarkDistribution,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.markDistributions);

  const loadMarkDistributions = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IMarkDistribution> =
          await markDistributionService.getMarkDistributions(params);
        dispatch(setMarkDistributions(response?.data?.items ?? []));
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
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load mark distributions'
            : 'Failed to load mark distributions';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadMarkDistribution = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IMarkDistribution> =
          await markDistributionService.getMarkDistribution(id);
        dispatch(setSelectedMarkDistribution(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load mark distribution'
            : 'Failed to load mark distribution';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createMarkDistribution = useCallback(
    async (data: IMarkDistributionCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IMarkDistribution =
          await markDistributionService.createMarkDistribution(data);
        dispatch(addMarkDistribution(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Mark distribution created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create mark distribution'
            : 'Failed to create mark distribution';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editMarkDistribution = useCallback(
    async (id: number, data: IMarkDistributionUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IMarkDistribution = await markDistributionService.updateMarkDistribution(
          id,
          data,
        );
        dispatch(updateMarkDistribution(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Mark distribution updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update mark distribution'
            : 'Failed to update mark distribution';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeMarkDistribution = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await markDistributionService.deleteMarkDistribution(id);
        dispatch(deleteMarkDistribution(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Mark distribution deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete mark distribution'
            : 'Failed to delete mark distribution';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getMarkDistributionById = useCallback(
    (id: number) => {
      if (selectedMarkDistribution && selectedMarkDistribution.id === id) {
        return;
      }

      const markDistribution = markDistributions.find(
        (markDistribution) => markDistribution.id === id,
      );
      if (markDistribution) {
        dispatch(setSelectedMarkDistribution(markDistribution));
      } else {
        loadMarkDistribution(id);
      }
    },
    [markDistributions, selectedMarkDistribution, dispatch, loadMarkDistribution],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (markDistribution: IMarkDistribution | null) => {
      dispatch(setSelectedMarkDistribution(markDistribution));
    },
    [dispatch],
  );

  return {
    markDistributions,
    selectedMarkDistribution,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadMarkDistributions,
    loadMarkDistribution,
    createMarkDistribution,
    editMarkDistribution,
    removeMarkDistribution,
    getMarkDistributionById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
