import {
  IAttendance,
  IAttendanceBulkGenerateRequest,
  IAttendanceBulkGenerateResponse,
  IAttendanceCreate,
  IAttendanceStudent,
  IAttendanceUpdate,
} from '@/types/attendance';
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

  markAttendance: async (data: {
    attendanceId: number;
    classNo: number;
    students: { studentId: number; status: string; captureMethod: string }[];
  }): Promise<void> => {
    await api.post('/attendance/mark', data);
  },

  getAttendanceStudents: async (params = {}): Promise<IBasePaginatedResponse<IAttendanceStudent>> => {
    const response = await api.get<IBasePaginatedResponse<IAttendanceStudent>>('/attendance/student', {
      params,
    });
    return response.data;
  },

  getAttendanceStudent: async (studentId: number): Promise<IAttendanceStudent> => {
    const response = await api.get<IBaseResponse<IAttendanceStudent>>(`/attendance/student/${studentId}`);
    return response.data.data;
  },

  bulkGenerateAttendance: async (
    data: IAttendanceBulkGenerateRequest,
  ): Promise<IAttendanceBulkGenerateResponse> => {
    const response = await api.post<IAttendanceBulkGenerateResponse>(
      '/attendance/student/bulk-generate',
      data,
    );
    return response.data;
  },
};
