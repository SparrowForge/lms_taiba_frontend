import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IBranch, IBranchCreate, IBranchUpdate} from '@/types/branch';
import {IBasePaginatedResponse, Status} from '@/types/common';

import {branchService} from '@/services/branchService';

import {
    addBranch,
    clearActionStatus,
    clearDetailsStatus,
    deleteBranch,
    setActionStatus,
    setBranches,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedBranch,
    updateBranch,
} from '@/store/slices/branchSlice';

export const useBranches = () => {
  const dispatch = useDispatch();
  const { branches, selectedBranch, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.branches);

  // Load branches with pagination and search
  const loadBranches = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IBranch> = await branchService.getBranches(params);
        dispatch(setBranches(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load branches'
            : 'Failed to load branches';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single branch
  const loadBranch = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBranch = await branchService.getBranch(id);
        dispatch(setSelectedBranch(response));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load branch'
            : 'Failed to load branch';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new branch
  const createBranch = useCallback(
    async (data: IBranchCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IBranch = await branchService.createBranch(data);
        dispatch(addBranch(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Branch created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create branch'
            : 'Failed to create branch';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing branch
  const editBranch = useCallback(
    async (id: number, data: IBranchUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IBranch = await branchService.updateBranch(id, data);
        dispatch(updateBranch(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Branch updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update branch'
            : 'Failed to update branch';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a branch
  const removeBranch = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await branchService.deleteBranch(id);
        dispatch(deleteBranch(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Branch deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete branch'
            : 'Failed to delete branch';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get branch by ID from the current list
  const getBranchById = useCallback(
    (id: number): IBranch | undefined => {
      return branches.find((branch) => branch.id === id);
    },
    [branches],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected branch
  const setSelected = useCallback(
    (branch: IBranch | null) => {
      dispatch(setSelectedBranch(branch));
    },
    [dispatch],
  );

  return {
    // State
    branches,
    selectedBranch,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadBranches,
    loadBranch,
    createBranch,
    editBranch,
    removeBranch,
    getBranchById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
