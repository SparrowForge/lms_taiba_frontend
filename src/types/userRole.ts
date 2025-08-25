import {IRole} from './role';
import {IUser} from './user';

export interface IUserRole {
  id: number;
  userId: number;
  roleId: number;
  user: IUser;
  role: IRole;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IUserRoleCreate {
  userId: number;
  roleId: number;
}

export interface IUserRoleUpdate {
  userId?: number;
  roleId?: number;
}

export interface IUserRoleBulkCreate {
  userId: number;
  roleIds: number[];
}

export interface IUserRoleBulkCreateResponse {
  removedCount: number;
  assignedCount: number;
  newAssignments: IUserRole[];
}
