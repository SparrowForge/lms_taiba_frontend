import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  IDiscountTemplate,
  IDiscountTemplateCreate,
  IDiscountTemplateUpdate,
} from '@/types/discountTemplate';

import { discountTemplateService } from '@/services/discountTemplateService';

import {
  addDiscountTemplate,
  clearActionStatus,
  clearDetailsStatus,
  deleteDiscountTemplate,
  setActionStatus,
  setDetailsStatus,
  setDiscountTemplates,
  setListStatus,
  setPagination,
  setSelectedDiscountTemplate,
  updateDiscountTemplate,
} from '@/store/slices/discountTemplateSlice';

export const useDiscountTemplates = () => {
  const dispatch = useDispatch();
  const { discountTemplates, selectedDiscountTemplate, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.discountTemplates);

  const loadDiscountTemplates = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IDiscountTemplate> =
          await discountTemplateService.getDiscountTemplates(params);
        dispatch(setDiscountTemplates(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load discount templates'
            : 'Failed to load discount templates';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadDiscountTemplate = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IDiscountTemplate> =
          await discountTemplateService.getDiscountTemplate(id);
        dispatch(setSelectedDiscountTemplate(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load discount template'
            : 'Failed to load discount template';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createDiscountTemplate = useCallback(
    async (data: IDiscountTemplateCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IDiscountTemplate = await discountTemplateService.createDiscountTemplate(
          data,
        );
        dispatch(addDiscountTemplate(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Discount template created successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to create discount template'
            : 'Failed to create discount template';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editDiscountTemplate = useCallback(
    async (id: number, data: IDiscountTemplateUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IDiscountTemplate = await discountTemplateService.updateDiscountTemplate(
          id,
          data,
        );
        dispatch(updateDiscountTemplate(response));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Discount template updated successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to update discount template'
            : 'Failed to update discount template';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeDiscountTemplate = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await discountTemplateService.deleteDiscountTemplate(id);
        dispatch(deleteDiscountTemplate(id));
        dispatch(
          setActionStatus({
            status: Status.SUCCESS,
            message: 'Discount template deleted successfully',
          }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message ||
              error?.message ||
              'Failed to delete discount template'
            : 'Failed to delete discount template';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getDiscountTemplateById = useCallback(
    (id: number) => {
      if (selectedDiscountTemplate && selectedDiscountTemplate.id === id) {
        return;
      }

      const found = discountTemplates.find((item) => item.id === id);
      if (found) {
        dispatch(setSelectedDiscountTemplate(found));
      } else {
        loadDiscountTemplate(id);
      }
    },
    [discountTemplates, selectedDiscountTemplate, dispatch, loadDiscountTemplate],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (item: IDiscountTemplate | null) => {
      dispatch(setSelectedDiscountTemplate(item));
    },
    [dispatch],
  );

  return {
    discountTemplates,
    selectedDiscountTemplate,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadDiscountTemplates,
    loadDiscountTemplate,
    createDiscountTemplate,
    editDiscountTemplate,
    removeDiscountTemplate,
    getDiscountTemplateById,
    clearAction,
    clearDetails,
    setSelected,
  };
};

