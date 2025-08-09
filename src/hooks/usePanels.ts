import {AxiosError} from 'axios';
import {useCallback} from 'react';

import {RootState} from '@/store';

import {IBasePaginatedResponse, Status} from '@/types/common';
import {IPanel} from '@/types/panel';

import {panelService} from '@/services/panelService';

import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {
    addPanel,
    deletePanel,
    setActionStatus,
    setDetailsStatus,
    setListStatus,
    setPagination,
    setPanels,
    setSelectedPanel,
    updatePanel,
} from '@/store/slices/panelSlice';


export const usePanels = () => {
  const dispatch = useAppDispatch();
  const { listStatus, detailsStatus, actionStatus, panels, selectedPanel, pagination } =
    useAppSelector((state: RootState) => state.panels);

  // List
  const loadPanels = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IPanel> = await panelService.getPanels(params);
        console.log(response);
        dispatch(setPanels(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load panels'
            : 'Failed to load panels';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Details
  const loadPanel = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response = await panelService.getPanel(id);
        dispatch(setSelectedPanel(response));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load panel'
            : 'Failed to load panel';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create
  const createPanel = useCallback(
    async (data: Partial<IPanel>) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await panelService.createPanel(data);
        dispatch(addPanel(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Panel created successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create panel'
            : 'Failed to create panel';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Update
  const editPanel = useCallback(
    async (id: number, data: Partial<IPanel>) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response = await panelService.updatePanel(id, data);
        dispatch(updatePanel(response));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Panel updated successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update panel'
            : 'Failed to update panel';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Delete
  const removePanel = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await panelService.deletePanel(id);
        dispatch(deletePanel(id));
        dispatch(
          setActionStatus({ status: Status.SUCCESS, message: 'Panel deleted successfully' }),
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete panel'
            : 'Failed to delete panel';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Helpers
  const getPanelById = useCallback(
    (id: number) => {
      return panels.find((p) => p.id === id) || null;
    },
    [panels],
  );

  return {
    panels,
    selectedPanel,
    pagination,
    listStatus,
    detailsStatus,
    actionStatus,
    loadPanels,
    loadPanel,
    createPanel,
    editPanel,
    removePanel,
    getPanelById,
  };
};
