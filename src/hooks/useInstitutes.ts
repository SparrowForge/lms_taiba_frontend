import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse, Status} from '@/types/common';
import {IInstitute, IInstituteCreate, IInstituteUpdate} from '@/types/institute';

import {instituteService} from '@/services/instituteService';

import {
    addInstitute,
    clearActionStatus,
    clearDetailsStatus,
    deleteInstitute,
    setActionStatus,
    setDetailsStatus,
    setInstitutes,
    setListStatus,
    setPagination,
    setSelectedInstitute,
    updateInstitute,
} from '@/store/slices/instituteSlice';

export const useInstitutes = () => {
  const dispatch = useDispatch();
  const { institutes, selectedInstitute, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.institutes);

  const loadInstitutes = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IInstitute> =
          await instituteService.getInstitutes(params);
        dispatch(setInstitutes(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load institutes'
            : 'Failed to load institutes';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadInstitute = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IInstitute> = await instituteService.getInstitute(id);
        dispatch(setSelectedInstitute(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load institute'
            : 'Failed to load institute';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createInstitute = useCallback(
    async (data: IInstituteCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IInstitute = await instituteService.createInstitute(data);
        dispatch(addInstitute(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Institute created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create institute'
            : 'Failed to create institute';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editInstitute = useCallback(
    async (id: number, data: IInstituteUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IInstitute = await instituteService.updateInstitute(id, data);
        dispatch(updateInstitute(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Institute updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update institute'
            : 'Failed to update institute';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeInstitute = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await instituteService.deleteInstitute(id);
        dispatch(deleteInstitute(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Institute deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete institute'
            : 'Failed to delete institute';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getInstituteById = useCallback(
    (id: number) => {
      if (selectedInstitute && selectedInstitute.id === id) {
        return;
      }

      const institute = institutes.find((item) => item.id === id);
      if (institute) {
        dispatch(setSelectedInstitute(institute));
      } else {
        loadInstitute(id);
      }
    },
    [institutes, selectedInstitute, dispatch, loadInstitute],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);
  const setSelected = useCallback(
    (item: IInstitute | null) => {
      dispatch(setSelectedInstitute(item));
    },
    [dispatch],
  );

  return {
    institutes,
    selectedInstitute,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadInstitutes,
    loadInstitute,
    createInstitute,
    editInstitute,
    removeInstitute,
    getInstituteById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
