import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IFeePaymentDetails,
  IFeePaymentDetailsCreate,
  IFeePaymentDetailsUpdate,
} from '@/types/feePaymentDetails';

import { feePaymentDetailsService } from '@/services/feePaymentDetailsService';

import {
  addFeePaymentDetail,
  clearActionStatus,
  clearDetailsStatus,
  deleteFeePaymentDetail,
  setActionStatus,
  setDetailsStatus,
  setFeePaymentDetails,
  setListStatus,
  setPagination,
  setSelectedFeePaymentDetail,
  updateFeePaymentDetail,
} from '@/store/slices/feePaymentDetailsSlice';

export const useFeePaymentDetails = () => {
  const dispatch = useDispatch();
  const {
    feePaymentDetails,
    selectedFeePaymentDetail,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.feePaymentDetails);

  const loadFeePaymentDetails = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IFeePaymentDetails> =
          await feePaymentDetailsService.getFeePaymentDetails(params);
        dispatch(setFeePaymentDetails(response?.data?.items ?? []));
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
              'Failed to load fee payment details'
            : 'Failed to load fee payment details';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadFeePaymentDetail = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IFeePaymentDetails> =
          await feePaymentDetailsService.getFeePaymentDetail(id);
        dispatch(setSelectedFeePaymentDetail(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load fee payment detail'
            : 'Failed to load fee payment detail';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createFeePaymentDetail = useCallback(
    async (data: IFeePaymentDetailsCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IFeePaymentDetails =
          await feePaymentDetailsService.createFeePaymentDetail(data);
        dispatch(addFeePaymentDetail(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Fee Payment Detail created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create fee payment detail'
            : 'Failed to create fee payment detail';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editFeePaymentDetail = useCallback(
    async (id: number, data: IFeePaymentDetailsUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IFeePaymentDetails = await feePaymentDetailsService.updateFeePaymentDetail(
          id,
          data,
        );
        dispatch(updateFeePaymentDetail(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Fee Payment Detail updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update fee payment detail'
            : 'Failed to update fee payment detail';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeFeePaymentDetail = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await feePaymentDetailsService.deleteFeePaymentDetail(id);
        dispatch(deleteFeePaymentDetail(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Fee Payment Detail deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete fee payment detail'
            : 'Failed to delete fee payment detail';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getFeePaymentDetailById = useCallback(
    (id: number) => {
      if (selectedFeePaymentDetail && selectedFeePaymentDetail.id === id) {
        return;
      }

      const feePaymentDetail = feePaymentDetails.find((item) => item.id === id);
      if (feePaymentDetail) {
        dispatch(setSelectedFeePaymentDetail(feePaymentDetail));
      } else {
        loadFeePaymentDetail(id);
      }
    },
    [feePaymentDetails, selectedFeePaymentDetail, dispatch, loadFeePaymentDetail],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);
  const setSelected = useCallback(
    (item: IFeePaymentDetails | null) => {
      dispatch(setSelectedFeePaymentDetail(item));
    },
    [dispatch],
  );

  return {
    feePaymentDetails,
    selectedFeePaymentDetail,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadFeePaymentDetails,
    loadFeePaymentDetail,
    createFeePaymentDetail,
    editFeePaymentDetail,
    removeFeePaymentDetail,
    getFeePaymentDetailById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
