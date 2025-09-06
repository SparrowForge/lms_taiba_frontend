import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Status} from '@/enums';
import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IFeeInstallmentPlan, IFeeInstallmentPlanCreate, IFeeInstallmentPlanUpdate,} from '@/types/feeInstallmentPlan';

import {feeInstallmentPlanService} from '@/services/feeInstallmentPlanService';

import {
    addFeeInstallmentPlan,
    clearActionStatus,
    clearDetailsStatus,
    deleteFeeInstallmentPlan,
    setActionStatus,
    setDetailsStatus,
    setFeeInstallmentPlans,
    setListStatus,
    setPagination,
    setSelectedFeeInstallmentPlan,
    updateFeeInstallmentPlan,
} from '@/store/slices/feeInstallmentPlanSlice';

export const useFeeInstallmentPlans = () => {
  const dispatch = useDispatch();
  const {
    feeInstallmentPlans,
    selectedFeeInstallmentPlan,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.feeInstallmentPlans);

  // Load fee installment plans with pagination and search
  const loadFeeInstallmentPlans = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IFeeInstallmentPlan> =
          await feeInstallmentPlanService.getFeeInstallmentPlans(params);
        dispatch(setFeeInstallmentPlans(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load fee installment plans'
            : 'Failed to load fee installment plans';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single fee installment plan
  const loadFeeInstallmentPlan = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IFeeInstallmentPlan> =
          await feeInstallmentPlanService.getFeeInstallmentPlan(id);
        dispatch(setSelectedFeeInstallmentPlan(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to load fee installment plan'
            : 'Failed to load fee installment plan';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new fee installment plan
  const createFeeInstallmentPlan = useCallback(
    async (data: IFeeInstallmentPlanCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IFeeInstallmentPlan =
          await feeInstallmentPlanService.createFeeInstallmentPlan(data);
        dispatch(addFeeInstallmentPlan(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Fee installment plan created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create fee installment plan'
            : 'Failed to create fee installment plan';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing fee installment plan
  const editFeeInstallmentPlan = useCallback(
    async (id: number, data: IFeeInstallmentPlanUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IFeeInstallmentPlan =
          await feeInstallmentPlanService.updateFeeInstallmentPlan(id, data);
        dispatch(updateFeeInstallmentPlan(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Fee installment plan updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update fee installment plan'
            : 'Failed to update fee installment plan';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a fee installment plan
  const removeFeeInstallmentPlan = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await feeInstallmentPlanService.deleteFeeInstallmentPlan(id);
        dispatch(deleteFeeInstallmentPlan(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Fee installment plan deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete fee installment plan'
            : 'Failed to delete fee installment plan';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get fee installment plan by id from the current list
  const getFeeInstallmentPlanById = useCallback(
    (id: number) => {
      const feeInstallmentPlan = feeInstallmentPlans.find((item) => item.id === id);
      if (feeInstallmentPlan) {
        dispatch(setSelectedFeeInstallmentPlan(feeInstallmentPlan));
      } else {
        loadFeeInstallmentPlan(id);
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

  // Set selected fee installment plan
  const setSelected = useCallback(
    (feeInstallmentPlan: IFeeInstallmentPlan | null) => {
      dispatch(setSelectedFeeInstallmentPlan(feeInstallmentPlan));
    },
    [dispatch],
  );

  return {
    // State
    feeInstallmentPlans,
    selectedFeeInstallmentPlan,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadFeeInstallmentPlans,
    loadFeeInstallmentPlan,
    createFeeInstallmentPlan,
    editFeeInstallmentPlan,
    removeFeeInstallmentPlan,
    getFeeInstallmentPlanById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
