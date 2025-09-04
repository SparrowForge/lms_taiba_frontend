import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {Status} from '@/types/common';
import {ICourseMaterial, ICourseMaterialCreate, ICourseMaterialUpdate,} from '@/types/courseMaterial';

import {courseMaterialService} from '@/services/courseMaterialService';

import {
    addCourseMaterial,
    clearActionStatus,
    clearDetailsStatus,
    deleteCourseMaterial,
    setActionStatus,
    setCourseMaterials,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedCourseMaterial,
    updateCourseMaterial,
} from '@/store/slices/courseMaterialSlice';

export const useCourseMaterials = () => {
  const dispatch = useDispatch();
  const {
    courseMaterials,
    selectedCourseMaterial,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.courseMaterials);

  const loadCourseMaterials = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response = await courseMaterialService.getCourseMaterials(params);
        dispatch(setCourseMaterials(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load course materials'
            : 'Failed to load course materials';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadCourseMaterial = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response = await courseMaterialService.getCourseMaterial(id);
        dispatch(setSelectedCourseMaterial(response));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load course material'
            : 'Failed to load course material';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createCourseMaterial = useCallback(
    async (data: ICourseMaterialCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await courseMaterialService.createCourseMaterial(data);
        dispatch(addCourseMaterial(response));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create course material'
            : 'Failed to create course material';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editCourseMaterial = useCallback(
    async (id: number, data: ICourseMaterialUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await courseMaterialService.updateCourseMaterial(id, data);
        dispatch(updateCourseMaterial(response));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update course material'
            : 'Failed to update course material';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeCourseMaterial = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await courseMaterialService.deleteCourseMaterial(id);
        dispatch(deleteCourseMaterial(id));
        dispatch(setActionStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete course material'
            : 'Failed to delete course material';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getCourseMaterialById = useCallback(
    (id: number) => {
      if (selectedCourseMaterial && selectedCourseMaterial.id === id) {
        return;
      }
      const courseMaterial = courseMaterials.find((cm: ICourseMaterial) => cm.id === id);
      if (courseMaterial) {
        dispatch(setSelectedCourseMaterial(courseMaterial));
      } else {
        loadCourseMaterial(id);
      }
    },
    [courseMaterials, dispatch, loadCourseMaterial],
  );

  const clearStatuses = useCallback(() => {
    dispatch(clearActionStatus());
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  return {
    courseMaterials,
    selectedCourseMaterial,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
    loadCourseMaterials,
    loadCourseMaterial,
    createCourseMaterial,
    editCourseMaterial,
    removeCourseMaterial,
    getCourseMaterialById,
    clearStatuses,
  };
};
