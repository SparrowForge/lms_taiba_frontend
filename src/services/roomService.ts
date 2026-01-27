import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IAvailableRoomsParams, IRoom, IRoomCreate, IRoomUpdate } from '@/types/room';

import { api } from '@/lib/axios';

export const roomService = {
  getRooms: async (params = {}): Promise<IBasePaginatedResponse<IRoom>> => {
    const response = await api.get<IBasePaginatedResponse<IRoom>>('/rooms', {
      params,
    });
    return response.data;
  },

  getRoom: async (id: number): Promise<IBaseResponse<IRoom>> => {
    const response = await api.get<IBaseResponse<IRoom>>(`/rooms/${id}`);
    return response.data;
  },

  createRoom: async (data: IRoomCreate): Promise<IRoom> => {
    const response = await api.post<IRoom>('/rooms', data);
    return response.data;
  },

  updateRoom: async (id: number, data: IRoomUpdate): Promise<IRoom> => {
    const response = await api.patch<IRoom>(`/rooms/${id}`, data);
    return response.data;
  },

  deleteRoom: async (id: number): Promise<void> => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },

  getAvailableRooms: async (params: IAvailableRoomsParams): Promise<IRoom[]> => {
    const response = await api.get<IRoom[]>('/rooms/available', { params });
    return response.data;
  },
};
