import {EntityStatus} from '@/enums';
import {UserType} from "@/enums/user-type.enum";

import {IPaginationMeta, IStatusState} from './common';
import {IRole} from './role';


// User interface matching the API response
export interface IUser {
  id: number;
  email: string;
  name: string;
  status: EntityStatus;
  phone: string;
  type: UserType;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  roles: IRole[];
}

export interface IUserCreate {
  email: string;
  name: string;
  status: EntityStatus;
  phone: string;
  type: UserType;
  facultyId?: number;
  studentId?: number;
}

export interface IUserUpdate {
  name: string;
  phone: string;
  status?: EntityStatus;
  type?: UserType;
  facultyId?: number;
  studentId?: number;
}

export interface IUserFilters {
  search?: string;
  type?: UserType;
  status?: EntityStatus;
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
