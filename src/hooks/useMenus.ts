import {AxiosError} from 'axios';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';

import {IBasePaginatedResponse, IBaseResponse, Status} from '@/types/common';
import {IMenu, IMenuCreate, IMenuUpdate} from '@/types/menu';
import {IPanelWithMenus} from '@/types/panel';

import {menuService} from '@/services/menuService';

import {
    addMenu,
    clearActionStatus,
    clearDetailsStatus,
    deleteMenu,
    setActionStatus,
    setDetailsStatus,
    setListStatus,
    setMenus,
    setMyMenus,
    setMyMenusStatus,
    setPagination,
    setPanelsWithMenus,
    setPanelsWithMenusStatus,
    setSelectedMenu,
    updateMenu,
} from '@/store/slices/menuSlice';

export const useMenus = () => {
  const dispatch = useDispatch();
  const {
    menus,
    selectedMenu,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
    myMenus,
    myMenusStatus,
    panelsWithMenus,
    panelsWithMenusStatus,
  } = useSelector((state: RootState) => state.menus);
  // my menu
  const loadMyMenus = useCallback(
    async (params = {}) => {
      try {
        dispatch(setMyMenusStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IMenu[]> = await menuService.getMyMenus(params);
        dispatch(setMyMenus(response?.data ?? []));
        dispatch(setMyMenusStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load my menus'
            : 'Failed to load my menus';
        dispatch(setMyMenusStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load panels with menus
  const loadPanelsWithMenus = useCallback(
    async (params = {}) => {
      try {
        dispatch(setPanelsWithMenusStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IPanelWithMenus[]> =
          await menuService.getPanelsWithMenus(params);

        // Sort panels by menu count (descending - most menus first)
        const sortedPanels = (response?.data ?? []).sort((a, b) => {
          const aMenuCount = a.menus?.length || 0;
          const bMenuCount = b.menus?.length || 0;
          return bMenuCount - aMenuCount;
        });

        dispatch(setPanelsWithMenus(sortedPanels));
        dispatch(setPanelsWithMenusStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load panels with menus'
            : 'Failed to load panels with menus';
        dispatch(setPanelsWithMenusStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load menus with pagination and search
  const loadMenus = useCallback(
    async (params = {}) => {
      try {
        dispatch(setListStatus({ status: Status.LOADING }));
        const response: IBasePaginatedResponse<IMenu> = await menuService.getMenus(params);
        console.log(response);
        dispatch(setMenus(response?.data?.items ?? []));
        dispatch(setPagination(response?.data?.meta ?? {}));
        dispatch(setListStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load menus'
            : 'Failed to load menus';
        dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Load a single menu
  const loadMenu = useCallback(
    async (id: number) => {
      try {
        dispatch(setDetailsStatus({ status: Status.LOADING }));
        const response: IBaseResponse<IMenu> = await menuService.getMenu(id);
        dispatch(setSelectedMenu(response.data));
        dispatch(setDetailsStatus({ status: Status.SUCCESS }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to load menu'
            : 'Failed to load menu';
        dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
      }
    },
    [dispatch],
  );

  // Create a new menu
  const createMenu = useCallback(
    async (data: IMenuCreate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IMenu = await menuService.createMenu(data);
        dispatch(addMenu(response));
        dispatch(setActionStatus({ status: Status.SUCCESS, message: 'Menu created successfully' }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to create menu'
            : 'Failed to create menu';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Edit an existing menu
  const editMenu = useCallback(
    async (id: number, data: IMenuUpdate) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        const response: IMenu = await menuService.updateMenu(id, data);
        dispatch(updateMenu(response));
        dispatch(setActionStatus({ status: Status.SUCCESS, message: 'Menu updated successfully' }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to update menu'
            : 'Failed to update menu';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove a menu
  const removeMenu = useCallback(
    async (id: number) => {
      try {
        dispatch(setActionStatus({ status: Status.LOADING }));
        await menuService.deleteMenu(id);
        dispatch(deleteMenu(id));
        dispatch(setActionStatus({ status: Status.SUCCESS, message: 'Menu deleted successfully' }));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || error?.message || 'Failed to delete menu'
            : 'Failed to delete menu';
        dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
        throw error;
      }
    },
    [dispatch],
  );

  // Get menu by ID from the current list
  const getMenuById = useCallback(
    (id: number) => {
      if (selectedMenu && selectedMenu.id === id) {
        return;
      }

      const menu = menus.find((menu) => menu.id === id);
      if (menu) {
        dispatch(setSelectedMenu(menu));
      } else {
        loadMenu(id);
      }
    },
    [menus, selectedMenu, dispatch, loadMenu],
  );

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected menu
  const setSelected = useCallback(
    (menu: IMenu | null) => {
      dispatch(setSelectedMenu(menu));
    },
    [dispatch],
  );

  return {
    // State
    menus,
    selectedMenu,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
    myMenus, //my menu
    myMenusStatus,
    panelsWithMenus,
    panelsWithMenusStatus,

    // Actions
    loadMenus,
    loadMenu,
    createMenu,
    editMenu,
    removeMenu,
    getMenuById,
    clearAction,
    clearDetails,
    setSelected,
    loadMyMenus, //my menu
    loadPanelsWithMenus,
  };
};
