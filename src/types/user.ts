import { EntityStatus } from '@/enums';
import { UserType } from '@/enums/user-type.enum';

import { IPaginationMeta, IStatusState } from './common';
import { IRole } from './role';
import { IFaculty } from './faculty';
import { IStudent } from './student';

// User interface matching the API response
export interface IUser {
  role: any;
  id: number;
  email: string;
  name: string;
  status: EntityStatus;
  phone: string;
  type: UserType;
  faculty?: IFaculty;
  student?: IStudent;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userRoles: IRole[];
  twoFaStatus:'active' | 'inactive'
}

export interface IDomainInfo {
  id: number;
  externalId: string;
  name: string;
  authenticationType: string;
  availabilityStatus: string | null;
  isAdminManaged: boolean;
  isDefault: boolean;
  isInitial: boolean;
  isRoot: boolean;
  isVerified: boolean;
  supportedServices: any[]; // or string[] if you know the type
  passwordValidityPeriodInDays: number | null;
  passwordNotificationWindowInDays: number | null;
  state: string | null;
  syncedAt: string;   // or Date if you prefer
  createdAt: string;  // or Date if you prefer
  updatedAt: string;  // or Date if you prefer
  deletedAt: string | null; // or Date | null
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
  domainStatus:IStatusState

  // Data
  users: IUser[];
  selectedUser: IUser | null;
  domains: IDomainInfo[]

  pagination: IPaginationMeta;
  filters: IUserFilters;
}
