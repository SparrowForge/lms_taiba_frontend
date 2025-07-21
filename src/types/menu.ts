import {IPanel} from './panel';

export interface IMenu {
  id: number;
  name: string;
  route: string;
  panelId: number;
  parentId: number | null;
  sortOrder: number;
  panel: IPanel;
  parent: IMenu | null;
  children: IMenu[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IMenuCreate {
  name: string;
  route: string;
  panelId: number;
  parentId?: number | null;
  sortOrder: number;
}

export interface IMenuUpdate {
  name?: string;
  route?: string;
  panelId?: number;
  parentId?: number | null;
  sortOrder?: number;
}
