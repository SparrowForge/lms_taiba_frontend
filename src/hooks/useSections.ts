import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '@/enums';
import { RootState } from '@/store';

import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { ISection, ISectionCreate, ISectionUpdate } from '@/types/section';

import { sectionService } from '@/services/sectionService';

import {
  addSection,
  clearActionStatus,
  clearDetailsStatus,
  deleteSection,
  setActionStatus,
  setDetailsStatus,
  setListStatus,
  setPagination,
  setSections,
  setSelectedSection,
  updateSection,
} from '@/store/slices/sectionSlice';

export const useSections = () => {
  const dispatch = useDispatch();
  const { sections, selectedSection, listStatus, detailsStatus, actionStatus, pagination } =
    useSelector((state: RootState) => state.sections);

  // Load sections with pagination and search
  const loadSections = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<ISection> = await sectionService.getSections(params);
        dispatch(setSections(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load sections'
            : 'Failed to load sections';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single section
  const loadSection = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<ISection> = await sectionService.getSection(id);
        dispatch(setSelectedSection(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load section'
            : 'Failed to load section';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new section
  const createSection = useCallback(
    async (data: ISectionCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ISection = await sectionService.createSection(data);
        dispatch(addSection(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Section created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create section'
            : 'Failed to create section';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing section
  const editSection = useCallback(
    async (id: number, data: ISectionUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: ISection = await sectionService.updateSection(id, data);
        dispatch(updateSection(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Section updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update section'
            : 'Failed to update section';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a section
  const removeSection = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await sectionService.deleteSection(id);
        dispatch(deleteSection(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Section deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete section'
            : 'Failed to delete section';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get section by ID from the current list
  const getSectionById = useCallback(
    (id: number) => {
      if (selectedSection && selectedSection.id === id) {
        return;
      }

      const section = sections.find((section) => section.id === id);
      if (section) {
        dispatch(setSelectedSection(section));
      } else {
        loadSection(id);
      }
    },
    [sections, selectedSection, dispatch, loadSection],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected section
  const setSelected = useCallback(
    (section: ISection | null) => {
      dispatch(setSelectedSection(section));
    },
    [dispatch],
  );

  return {
    // State
    sections,
    selectedSection,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

    // Actions
    loadSections,
    loadSection,
    createSection,
    editSection,
    removeSection,
    getSectionById,
    clearAction,
    clearDetails,
    setSelected,
  };
};

