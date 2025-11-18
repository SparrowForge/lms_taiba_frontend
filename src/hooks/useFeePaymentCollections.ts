import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IFeePaymentCollection,
  IFeePaymentCollectionCreate,
  IFeePaymentCollectionUpdate,
} from '@/types/feePaymentCollection';

import { feePaymentCollectionService } from '@/services/feePaymentCollectionService';

import {
  addFeePaymentCollection,
  clearActionStatus,
  clearDetailsStatus,
  deleteFeePaymentCollection,
  setActionStatus,
  setDetailsStatus,
  setFeePaymentCollections,
  setListStatus,
  setPagination,
  setSelectedFeePaymentCollection,
  updateFeePaymentCollection,
} from '@/store/slices/feePaymentCollectionSlice';

export const useFeePaymentCollections = () => {
  const dispatch = useDispatch();
  const {
    feePaymentCollections,
    selectedFeePaymentCollection,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.feePaymentCollections);

  const loadFeePaymentCollections = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IFeePaymentCollection> =
          await feePaymentCollectionService.getFeePaymentCollections(params);
        dispatch(setFeePaymentCollections(response?.data?.items ?? []));
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
              'Failed to load fee payment collections'
            : 'Failed to load fee payment collections';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadFeePaymentCollection = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IFeePaymentCollection> =
          await feePaymentCollectionService.getFeePaymentCollection(id);
        dispatch(setSelectedFeePaymentCollection(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load fee payment collection'
            : 'Failed to load fee payment collection';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createFeePaymentCollection = useCallback(
    async (data: IFeePaymentCollectionCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IFeePaymentCollection =
          await feePaymentCollectionService.createFeePaymentCollection(data);
        dispatch(addFeePaymentCollection(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Fee Payment Collection created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create fee payment collection'
            : 'Failed to create fee payment collection';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editFeePaymentCollection = useCallback(
    async (id: number, data: IFeePaymentCollectionUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IFeePaymentCollection =
          await feePaymentCollectionService.updateFeePaymentCollection(id, data);
        dispatch(updateFeePaymentCollection(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Fee Payment Collection updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update fee payment collection'
            : 'Failed to update fee payment collection';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeFeePaymentCollection = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await feePaymentCollectionService.deleteFeePaymentCollection(id);
        dispatch(deleteFeePaymentCollection(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Fee Payment Collection deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete fee payment collection'
            : 'Failed to delete fee payment collection';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getFeePaymentCollectionById = useCallback(
    (id: number) => {
      if (selectedFeePaymentCollection && selectedFeePaymentCollection.id === id) {
        return;
      }

      const feePaymentCollection = feePaymentCollections.find((item) => item.id === id);
      if (feePaymentCollection) {
        dispatch(setSelectedFeePaymentCollection(feePaymentCollection));
      } else {
        loadFeePaymentCollection(id);
      }
    },
    [feePaymentCollections, selectedFeePaymentCollection, dispatch, loadFeePaymentCollection],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);
  const setSelected = useCallback(
    (item: IFeePaymentCollection | null) => {
      dispatch(setSelectedFeePaymentCollection(item));
    },
    [dispatch],
  );

  return {
    feePaymentCollections,
    selectedFeePaymentCollection,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadFeePaymentCollections,
    loadFeePaymentCollection,
    createFeePaymentCollection,
    editFeePaymentCollection,
    removeFeePaymentCollection,
    getFeePaymentCollectionById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
