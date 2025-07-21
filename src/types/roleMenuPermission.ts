import {IRole} from './role';
import {IMenu} from './menu';

export interface IRoleMenuPermission {
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
