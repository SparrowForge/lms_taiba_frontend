import { IAttendance, IAttendanceCreate, IAttendanceUpdate } from '@/types/attendance';
import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';

import { api } from '@/lib/axios';

export const attendanceService = {
  getAttendances: async (params = {}): Promise<IBasePaginatedResponse<IAttendance>> => {
    const response = await api.get<IBasePaginatedResponse<IAttendance>>('/attendance', { params });
    return response.data;
  },

  getAttendance: async (id: number): Promise<IAttendance> => {
    const response = await api.get<IBaseResponse<IAttendance>>(`/attendance/${id}`);
    return response.data.data;
  },

  createAttendance: async (data: IAttendanceCreate): Promise<IAttendance> => {
    const response = await api.post<IAttendance>('/attendance', data);
    return response.data;
  },

  updateAttendance: async (id: number, data: IAttendanceUpdate): Promise<IAttendance> => {
    const response = await api.put<IAttendance>(`/attendance/${id}`, data);
    return response.data;
  },

  deleteAttendance: async (id: number): Promise<void> => {
    await api.delete(`/attendance/${id}`);
  },
};
