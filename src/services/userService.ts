import {IBasePaginatedResponse} from '@/types/common';
import {IUser, IUserCreate, IUserUpdate} from '@/types/user';

import {api} from '@/lib/axios';

export const userService = {
  // Get paginated users
  async getUsers(params = {}): Promise<IBasePaginatedResponse<IUser>> {
    const response = await api.get<IBasePaginatedResponse<IUser>>(`/users`, { params });
    return response.data;
  },

  // Get single user by ID
  async getUser(id: number): Promise<IUser> {
    const response = await api.get<IUser>(`/users/${id}`);
    return response.data;
  },

  // Create new user
  async createUser(userData: IUserCreate): Promise<IUser> {
    const response = await api.post<IUser>('/users', userData);
    return response.data;
  },

  // Update user
  async updateUser(id: number, userData: IUserUpdate): Promise<IUser> {
    const response = await api.patch<IUser>(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  // Update user status
  async updateUserStatus(id: number, status: 'active' | 'inactive' | 'pending'): Promise<IUser> {
    const response = await api.patch<IUser>(`/users/${id}/status`, { status });
    return response.data;
  },

  // Get users by role
  async getUsersByRole(role: 'admin' | 'teacher' | 'student'): Promise<IUser[]> {
    const response = await api.get<IUser[]>(`/users/role/${role}`);
    return response.data;
  },
};
