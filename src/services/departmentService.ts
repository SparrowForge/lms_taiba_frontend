import {IBasePaginatedResponse} from '@/types/common';
import {IDepartment, IDepartmentCreate, IDepartmentUpdate} from '@/types/department';

import {api} from '@/lib/axios';

export const departmentService = {
  // Get all departments with pagination and search
  getDepartments: async (params = {}): Promise<IBasePaginatedResponse<IDepartment>> => {
    const response = await api.get<IBasePaginatedResponse<IDepartment>>('/departments', { params });
    return response.data;
  },

  // Get a single department by ID
  getDepartment: async (id: number): Promise<IDepartment> => {
    const response = await api.get<IDepartment>(`/departments/${id}`);
    return response.data;
  },

  // Create a new department
  createDepartment: async (data: IDepartmentCreate): Promise<IDepartment> => {
    const response = await api.post<IDepartment>('/departments', data);
    return response.data;
  },

  // Update an existing department
  updateDepartment: async (id: number, data: IDepartmentUpdate): Promise<IDepartment> => {
    const response = await api.patch<IDepartment>(`/departments/${id}`, data);
    return response.data;
  },

  // Delete a department
  deleteDepartment: async (id: number): Promise<void> => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  },
};
