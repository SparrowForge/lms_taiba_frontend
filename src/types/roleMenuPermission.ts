import { IMenu } from './menu';
import { IRole } from './role';

export interface IRoleMenuPermission {
  id: number;
  roleId: number;
  menuId: number;
  view: boolean;
  insert: boolean;
  update: boolean;
  delete: boolean;
  role: IRole;
  menu: IMenu;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IRoleMenuPermissionCreate {
  roleId: number;
  menuId: number;
  view: boolean;
  insert: boolean;
  update: boolean;
  delete: boolean;
}

export interface IRoleMenuPermissionUpdate {
  view?: boolean;
  insert?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface IRoleWithMenuPermission extends IRole {
  menuPermissions: IRoleMenuPermission[];
}
