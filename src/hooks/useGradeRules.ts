import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IGradeRule, IGradeRuleCreate, IGradeRuleUpdate } from '@/types/gradeRule';

import { gradeRuleService } from '@/services/gradeRuleService';

import {
  addGradeRule,
  clearActionStatus,
  clearDetailsStatus,
  deleteGradeRule,
  setActionStatus,
  setDetailsStatus,
  setGradeRules,
  setListStatus,
  setPagination,
  setSelectedGradeRule,
  updateGradeRule,
} from '@/store/slices/gradeRuleSlice';

export const useGradeRules = () => {
  const dispatch = useDispatch();
  const { gradeRules, selectedGradeRule, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.gradeRules);

  const loadGradeRules = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IGradeRule> =
          await gradeRuleService.getGradeRules(params);
        dispatch(setGradeRules(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load grade rules'
            : 'Failed to load grade rules';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadGradeRule = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IGradeRule> = await gradeRuleService.getGradeRule(id);
        dispatch(setSelectedGradeRule(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load grade rule'
            : 'Failed to load grade rule';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createGradeRule = useCallback(
    async (data: IGradeRuleCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IGradeRule = await gradeRuleService.createGradeRule(data);
        dispatch(addGradeRule(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Grade rule created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create grade rule'
            : 'Failed to create grade rule';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editGradeRule = useCallback(
    async (id: number, data: IGradeRuleUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IGradeRule = await gradeRuleService.updateGradeRule(id, data);
        dispatch(updateGradeRule(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Grade rule updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update grade rule'
            : 'Failed to update grade rule';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeGradeRule = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await gradeRuleService.deleteGradeRule(id);
        dispatch(deleteGradeRule(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Grade rule deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete grade rule'
            : 'Failed to delete grade rule';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getGradeRuleById = useCallback(
    (id: number) => {
      if (selectedGradeRule && selectedGradeRule.id === id) {
        return;
      }

      const gradeRule = gradeRules.find((gradeRule) => gradeRule.id === id);
      if (gradeRule) {
        dispatch(setSelectedGradeRule(gradeRule));
      } else {
        loadGradeRule(id);
      }
    },
    [gradeRules, selectedGradeRule, dispatch, loadGradeRule],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (gradeRule: IGradeRule | null) => {
      dispatch(setSelectedGradeRule(gradeRule));
    },
    [dispatch],
  );

  return {
    gradeRules,
    selectedGradeRule,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadGradeRules,
    loadGradeRule,
    createGradeRule,
    editGradeRule,
    removeGradeRule,
    getGradeRuleById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
