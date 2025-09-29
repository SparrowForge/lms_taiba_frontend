import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Status} from '@/enums';
import {RootState} from '@/store';

import {IBatch, IBatchCreate, IBatchUpdate, IBatchWithSemestersCreate, IBatchWithSemestersUpdate,} from '@/types/batch';
import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';

import {batchService} from '@/services/batchService';

import {
    addBatch,
    clearActionStatus,
    clearDetailsStatus,
    deleteBatch,
    setActionStatus,
    setBatches,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedBatch,
    updateBatch,
} from '@/store/slices/batchSlice';

export const useBatches = () => {
  const dispatch = useDispatch();
  const { batches, selectedBatch, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.batches);

  // Load batches with pagination and search
  const loadBatches = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IBatch> = await batchService.getBatches(params);
        dispatch(setBatches(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load batches'
            : 'Failed to load batches';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single batch
  const loadBatch = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IBatch> = await batchService.getBatch(id);
        dispatch(setSelectedBatch(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load batch'
            : 'Failed to load batch';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single batch by code from public endpoint
  const loadBatchByCodePublic = useCallback(
    async (code: string) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IBatch> = await batchService.getBatchByCodePublic(code);
        dispatch(setSelectedBatch(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load batch'
            : 'Failed to load batch';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Create a new batch
  const createBatch = useCallback(
    async (data: IBatchCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IBatch = await batchService.createBatch(data);
        dispatch(addBatch(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Batch created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create batch'
            : 'Failed to create batch';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Create a new batch with semesters
  const createBatchWithSemesters = useCallback(
    async (data: IBatchWithSemestersCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IBatch = await batchService.createBatchWithSemesters(data);
        dispatch(addBatch(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Batch with semesters created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create batch with semesters'
            : 'Failed to create batch with semesters';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing batch
  const editBatch = useCallback(
    async (id: number, data: IBatchUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IBatch = await batchService.updateBatch(id, data);
        dispatch(updateBatch(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Batch updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update batch'
            : 'Failed to update batch';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing batch with semesters
  const editBatchWithSemesters = useCallback(
    async (id: number, data: IBatchWithSemestersUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IBatch = await batchService.updateBatchWithSemesters(id, data);
        dispatch(updateBatch(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Batch with semesters updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update batch with semesters'
            : 'Failed to update batch with semesters';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a batch
  const removeBatch = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await batchService.deleteBatch(id);
        dispatch(deleteBatch(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Batch deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete batch'
            : 'Failed to delete batch';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get batch by ID from the current list
  const getBatchById = useCallback(
    (id: number) => {
      if (selectedBatch && selectedBatch.id === id) {
        return;
      }

      const batch = batches.find((batch) => batch.id === id);
      if (batch) {
        dispatch(setSelectedBatch(batch));
      } else {
        loadBatch(id);
      }
    },
    [batches, selectedBatch, dispatch, loadBatch],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected batch
  const setSelected = useCallback(
    (batch: IBatch | null) => {
      dispatch(setSelectedBatch(batch));
    },
    [dispatch],
  );

  // Clear batches
  const clearBatches = useCallback(() => {
    dispatch(setBatches([]));
  }, [dispatch]);

  return {
    // State
    batches,
    selectedBatch,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadBatches,
    loadBatch,
    loadBatchByCodePublic,
    createBatch,
    createBatchWithSemesters,
    editBatch,
    editBatchWithSemesters,
    removeBatch,
    getBatchById,
    clearAction,
    clearDetails,
    setSelected,
    clearBatches,
  };
};
