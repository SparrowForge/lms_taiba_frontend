import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IRoomType, IRoomTypeCreate, IRoomTypeUpdate} from '@/types/roomType';

import {api} from '@/lib/axios';

export const roomTypeService = {
  getRoomTypes: async (params = {}): Promise<IBasePaginatedResponse<IRoomType>> => {
    const response = await api.get<IBasePaginatedResponse<IRoomType>>('/room-types', {
      params,
    });
    return response.data;
  },

  getRoomType: async (id: number): Promise<IBaseResponse<IRoomType>> => {
    const response = await api.get<IBaseResponse<IRoomType>>(`/room-types/${id}`);
    return response.data;
  },

  createRoomType: async (data: IRoomTypeCreate): Promise<IRoomType> => {
    const response = await api.post<IRoomType>('/room-types', data);
    return response.data;
  },

  updateRoomType: async (id: number, data: IRoomTypeUpdate): Promise<IRoomType> => {
    const response = await api.patch<IRoomType>(`/room-types/${id}`, data);
    return response.data;
  },

  deleteRoomType: async (id: number): Promise<void> => {
    const response = await api.delete(`/room-types/${id}`);
    return response.data;
  },
};
