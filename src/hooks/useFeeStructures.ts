import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IFeeStructure,
  IFeeStructureBulkCreate,
  IFeeStructureCreate,
  IFeeStructureUpdate,
} from '@/types/feeStructure';

import { feeStructureService } from '@/services/feeStructureService';

import {
  addFeeStructure,
  clearActionStatus,
  clearDetailsStatus,
  deleteFeeStructure,
  setActionStatus,
  setDetailsStatus,
  setFeeStructures,
  setListStatus,
  setPagination,
  setSelectedFeeStructure,
  updateFeeStructure,
} from '@/store/slices/feeStructureSlice';

export const useFeeStructures = () => {
  const dispatch = useDispatch();
  const {
    feeStructures,
    selectedFeeStructure,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.feeStructures);

  const loadFeeStructures = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IFeeStructure> =
          await feeStructureService.getFeeStructures(params);
        dispatch(setFeeStructures(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load fee structures'
            : 'Failed to load fee structures';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadFeeStructure = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IFeeStructure> =
          await feeStructureService.getFeeStructure(id);
        dispatch(setSelectedFeeStructure(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load fee structure'
            : 'Failed to load fee structure';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createFeeStructure = useCallback(
    async (data: IFeeStructureCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IFeeStructure = await feeStructureService.createFeeStructure(data);
        dispatch(addFeeStructure(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Fee structure created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create fee structure'
            : 'Failed to create fee structure';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const createFeeStructureBulk = useCallback(
    async (data: IFeeStructureBulkCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IFeeStructure = await feeStructureService.createFeeStructureBulk(data);
        dispatch(addFeeStructure(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Fee structure with installment plans created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create fee structure with installment plans'
            : 'Failed to create fee structure with installment plans';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editFeeStructure = useCallback(
    async (id: number, data: IFeeStructureUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IFeeStructure = await feeStructureService.updateFeeStructure(id, data);
        dispatch(updateFeeStructure(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Fee structure updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update fee structure'
            : 'Failed to update fee structure';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeFeeStructure = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await feeStructureService.deleteFeeStructure(id);
        dispatch(deleteFeeStructure(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Fee structure deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete fee structure'
            : 'Failed to delete fee structure';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getFeeStructureById = useCallback(
    (id: number) => {
      if (selectedFeeStructure && selectedFeeStructure.id === id) {
        return;
      }

      const feeStructure = feeStructures.find((feeStructure) => feeStructure.id === id);
      if (feeStructure) {
        dispatch(setSelectedFeeStructure(feeStructure));
      } else {
        loadFeeStructure(id);
      }
    },
    [feeStructures, selectedFeeStructure, dispatch, loadFeeStructure],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (feeStructure: IFeeStructure | null) => {
      dispatch(setSelectedFeeStructure(feeStructure));
    },
    [dispatch],
  );

  return {
    feeStructures,
    selectedFeeStructure,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadFeeStructures,
    loadFeeStructure,
    createFeeStructure,
    createFeeStructureBulk,
    editFeeStructure,
    removeFeeStructure,
    getFeeStructureById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
