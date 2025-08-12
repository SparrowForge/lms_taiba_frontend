import { IBasePaginatedResponse } from '@/types/common';
import { IMenu, IMenuCreate, IMenuUpdate, IMyMenusResponse } from '@/types/menu';

import { api } from '@/lib/axios';

export const menuService = {
  // Get all menus with pagination and search
  getMenus: async (params = {}): Promise<IBasePaginatedResponse<IMenu>> => {
    const response = await api.get<IBasePaginatedResponse<IMenu>>('/menus', { params });
    return response.data;
  },

  // Get a single menu by ID
  getMenu: async (id: number): Promise<IMenu> => {
    const response = await api.get<IMenu>(`/menus/${id}`);
    return response.data;
  },

  // Create a new menu
  createMenu: async (data: IMenuCreate): Promise<IMenu> => {
    const response = await api.post<IMenu>('/menus', data);
    return response.data;
  },

  // Update an existing menu
  updateMenu: async (id: number, data: IMenuUpdate): Promise<IMenu> => {
    const response = await api.patch<IMenu>(`/menus/${id}`, data);
    return response.data;
  },

  // Delete a menu
  deleteMenu: async (id: number): Promise<void> => {
    const response = await api.delete(`/menus/${id}`);
    return response.data;
  },

  //get my menus
  // getMyMenus: async (params = {}): Promise<IBasePaginatedResponse<IMenu>> => {
  //   const response = await api.get<IBasePaginatedResponse<IMenu>>('/menus/my-menus', { params });
  //   return response.data;
  // },



getMyMenus: async (params = {}): Promise<IMyMenusResponse> => {
  const response = await api.get<IMyMenusResponse>('/menus/my-menus', { params });
  return response.data;
},

};
