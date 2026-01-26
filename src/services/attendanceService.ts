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

  markAttendance: async (data: {
    attendanceId: number;
    classNo: number;
    students: { studentId: number; status: string; captureMethod: string }[];
  }): Promise<void> => {
    await api.post('/attendance/mark', data);
  },

  getStudentAttendanceRecords: async (params: {
    courseId?: number;
    batchId?: number;
    sectionId?: number;
    subjectId?: number;
    semesterId?: number;
    facultyId?: number;
    page?: number;
    limit?: number;
  } = {}): Promise<
    Array<{
      studentId: number;
      student: { id: number; firstName?: string; middleName?: string; lastName?: string; applicationNo?: string; registrationNo?: string; batchId?: number; [key: string]: unknown };
      attendancePattern: string;
      captureMethodPattern: string;
    }>
  > => {
    const response = await api.get<{ data?: { items?: unknown[] } }>('/attendance/student', {
      params: { ...params, limit: params.limit ?? 99 },
    });
    const body = response.data as { data?: { items?: unknown[] } };
    return (body?.data?.items ?? []) as Array<{
      studentId: number;
      student: { id: number; firstName?: string; middleName?: string; lastName?: string; applicationNo?: string; registrationNo?: string; batchId?: number; [key: string]: unknown };
      attendancePattern: string;
      captureMethodPattern: string;
    }>;
  },
};
