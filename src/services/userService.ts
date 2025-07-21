import {api} from '@/lib/axios'
import {IUser, IUserCreate, IUserFilters, IUserUpdate} from '@/types/user'
import {IBasePaginatedResponse} from '@/types/common'

export const userService = {
  // Get paginated users
  async getUsers(filters: IUserFilters = {}): Promise<IBasePaginatedResponse<IUser>> {
    const params = new URLSearchParams()

    if (filters.search) params.append('search', filters.search)
    if (filters.role) params.append('role', filters.role)
    if (filters.status) params.append('status', filters.status)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const response = await api.get<IBasePaginatedResponse<IUser>>(`/users?${params.toString()}`)
    return response.data
  },

  // Get single user by ID
  async getUser(id: number): Promise<IUser> {
    const response = await api.get<IUser>(`/users/${id}`)
    return response.data
  },

  // Create new user
  async createUser(userData: IUserCreate): Promise<IUser> {
    const response = await api.post<IUser>('/users', userData)
    return response.data
  },

  // Update user
  async updateUser(id: number, userData: IUserUpdate): Promise<IUser> {
    const response = await api.put<IUser>(`/users/${id}`, userData)
    return response.data
  },

  // Delete user
  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`)
  },

  // Update user status
  async updateUserStatus(id: number, status: 'active' | 'inactive' | 'pending'): Promise<IUser> {
    const response = await api.patch<IUser>(`/users/${id}/status`, {status})
    return response.data
  },

  // Get users by role
  async getUsersByRole(role: 'admin' | 'teacher' | 'student'): Promise<IUser[]> {
    const response = await api.get<IUser[]>(`/users/role/${role}`)
    return response.data
  },

  // Search users
  async searchUsers(query: string): Promise<IUser[]> {
    const response = await api.get<IUser[]>(`/users/search?q=${encodeURIComponent(query)}`)
    return response.data
  }
}
