import {IPanel} from './panel';

export interface IMenu {
  
  id: number;
  name: string;
  localName:string;
  icon: string;
  route: string;
  panelId: number;
  parentId: number | null;
  sortOrder: number;
  panel: IPanel;
  parent: IMenu | null;
  children: IMenu[];
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IMenuCreate {
  name: string;
  localName: string;
  icon: string;
  route: string;
  panelId: number;
  parentId?: number | null;
  sortOrder: number;
  status: string;
}

export interface IMenuUpdate {
  name?: string;
  localName?: string;
  icon?: string;
  route?: string;
  panelId?: number;
  parentId?: number | null;
  sortOrder?: number;
  status?: string;
}