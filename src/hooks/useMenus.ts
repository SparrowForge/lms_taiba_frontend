import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {
    addMenu,
    clearActionStatus,
    clearDetailsStatus,
    deleteMenu,
    setActionStatus,
    setDetailsStatus,
    setListStatus,
    setMenus,
    setPagination,
    setSelectedMenu,
    updateMenu,
} from '@/store/slices/menuSlice';
import {menuService} from '@/services/menuService';
import {IMenu, IMenuCreate, IMenuUpdate} from '@/types/menu';
import {IBasePaginatedResponse, Status} from '@/types/common';

export const useMenus = () => {
  const dispatch = useDispatch();
  const {
    menus,
    selectedMenu,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,
  } = useSelector((state: RootState) => state.menus);

  // Load menus with pagination and search
  const loadMenus = useCallback(async (params = {}) => {
    try {
      dispatch(setListStatus({ status: Status.LOADING }));
      const response: IBasePaginatedResponse<IMenu> = await menuService.getMenus(params);
      console.log(response);
      dispatch(setMenus(response?.data?.items ?? []));
      dispatch(setPagination(response?.data?.meta ?? {}));
      dispatch(setListStatus({ status: Status.SUCCESS }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load menus';
      dispatch(setListStatus({ status: Status.FAILED, message: errorMessage }));
    }
  }, [dispatch]);

  // Load a single menu
  const loadMenu = useCallback(async (id: number) => {
    try {
      dispatch(setDetailsStatus({ status: Status.LOADING }));
      const response: IMenu = await menuService.getMenu(id);
      dispatch(setSelectedMenu(response));
      dispatch(setDetailsStatus({ status: Status.SUCCESS }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load menu';
      dispatch(setDetailsStatus({ status: Status.FAILED, message: errorMessage }));
    }
  }, [dispatch]);

  // Create a new menu
  const createMenu = useCallback(async (data: IMenuCreate) => {
    try {
      dispatch(setActionStatus({ status: Status.LOADING }));
      const response: IMenu = await menuService.createMenu(data);
      dispatch(addMenu(response));
      dispatch(setActionStatus({ status: Status.SUCCESS, message: 'Menu created successfully' }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create menu';
      dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
      throw error;
    }
  }, [dispatch]);

  // Edit an existing menu
  const editMenu = useCallback(async (id: number, data: IMenuUpdate) => {
    try {
      dispatch(setActionStatus({ status: Status.LOADING }));
      const response: IMenu = await menuService.updateMenu(id, data);
      dispatch(updateMenu(response));
      dispatch(setActionStatus({ status: Status.SUCCESS, message: 'Menu updated successfully' }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update menu';
      dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
      throw error;
    }
  }, [dispatch]);

  // Remove a menu
  const removeMenu = useCallback(async (id: number) => {
    try {
      dispatch(setActionStatus({ status: Status.LOADING }));
      await menuService.deleteMenu(id);
      dispatch(deleteMenu(id));
      dispatch(setActionStatus({ status: Status.SUCCESS, message: 'Menu deleted successfully' }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete menu';
      dispatch(setActionStatus({ status: Status.FAILED, message: errorMessage }));
      throw error;
    }
  }, [dispatch]);

  // Get menu by ID from the current list
  const getMenuById = useCallback((id: number): IMenu | undefined => {
    return menus.find((menu) => menu.id === id);
  }, [menus]);

  // Clear action status
  const clearAction = useCallback(() => {
    dispatch(clearActionStatus());
  }, [dispatch]);

  // Clear details status
  const clearDetails = useCallback(() => {
    dispatch(clearDetailsStatus());
  }, [dispatch]);

  // Set selected menu
  const setSelected = useCallback((menu: IMenu | null) => {
    dispatch(setSelectedMenu(menu));
  }, [dispatch]);

  return {
    // State
    menus,
    selectedMenu,
    listStatus,
    detailsStatus,
    actionStatus,
    pagination,

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
  };
};
