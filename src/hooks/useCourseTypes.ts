import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse, Status} from '@/types/common';
import {ICourseType, ICourseTypeCreate, ICourseTypeUpdate} from '@/types/courseType';

import {courseTypeService} from '@/services/courseTypeService';

import {
    addCourseType,
    clearActionStatus,
    clearDetailsStatus,
    deleteCourseType,
    setActionStatus,
    setCourseTypes,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setSelectedCourseType,
    updateCourseType,
} from '@/store/slices/courseTypeSlice';


export const useCourseTypes = () => {
  const dispatch = useDispatch();
  const { courseTypes, selectedCourseType, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.courseTypes);

  const loadCourseTypes = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<ICourseType> =
          await courseTypeService.getCourseTypes(params);
        dispatch(setCourseTypes(response?.data?.items ?? []));
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
            ? error?.response?.data?.message || error?.message || 'Failed to load course types'
            : 'Failed to load course types';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const loadCourseType = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<ICourseType> = await courseTypeService.getCourseType(id);
        dispatch(setSelectedCourseType(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load course type'
            : 'Failed to load course type';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  const createCourseType = useCallback(
    async (data: ICourseTypeCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ICourseType = await courseTypeService.createCourseType(data);
        dispatch(addCourseType(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Course Type created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create course type'
            : 'Failed to create course type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const editCourseType = useCallback(
    async (id: number, data: ICourseTypeUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ICourseType = await courseTypeService.updateCourseType(id, data);
        dispatch(updateCourseType(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Course Type updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update course type'
            : 'Failed to update course type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const removeCourseType = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await courseTypeService.deleteCourseType(id);
        dispatch(deleteCourseType(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Course Type deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete course type'
            : 'Failed to delete course type';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  const getCourseTypeById = useCallback(
    (id: number) => {
      if (selectedCourseType && selectedCourseType.id === id) {
        return;
      }

      const courseType = courseTypes.find((item) => item.id === id);
      if (courseType) {
        dispatch(setSelectedCourseType(courseType));
      } else {
        loadCourseType(id);
      }
    },
    [courseTypes, selectedCourseType, dispatch, loadCourseType],
  );

  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  const setSelected = useCallback(
    (item: ICourseType | null) => {
      dispatch(setSelectedCourseType(item));
    },
    [dispatch],
  );

  return {
    courseTypes,
    selectedCourseType,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    loadCourseTypes,
    loadCourseType,
    createCourseType,
    editCourseType,
    removeCourseType,
    getCourseTypeById,
    clearAction,
    clearDetails,
    setSelected,
  };
};
