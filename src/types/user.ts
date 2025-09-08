import { IPaginationMeta, IStatusState } from './common';

// User interface matching the API response
export interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  status: 'active' | 'inactive' | 'pending';
  phone: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IUserCreate {
  email: string;
  firstName: string;
  lastName: string;
  status: 'active' | 'inactive' | 'pending';
  phone: string;
}

export interface IUserUpdate {
  firstName: string;
  lastName: string;
  phone: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface IUserFilters {
  search?: string;
  role?: 'admin' | 'teacher' | 'student';
  status?: 'active' | 'inactive' | 'pending';
  page?: number;
  limit?: number;
}

export interface IUsersState {
  // Status fields as IStatusState objects
  listStatus: IStatusState;
  detailsStatus: IStatusState;
  actionStatus: IStatusState;

  // Data
  users: IUser[];
  selectedUser: IUser | null;

  pagination: IPaginationMeta;
  filters: IUserFilters;
}
