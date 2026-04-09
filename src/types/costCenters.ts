export interface ICostCenter {
  id: number;
  parentId?: number | null;
  parent?: ICostCenter | null;
  children?: ICostCenter[];
  costCode?: string;
  costName: string;
  remarks?: string;
  status: string; // '0' | '1'
  level?: number;
  isTransaction?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ICostCenterCreate {
  parentId?: number;
  costCode?: string;
  costName: string;
  remarks?: string;
  status?: string;
  level?: number;
}

export interface ICostCenterUpdate extends Partial<ICostCenterCreate> {
  id: number;
}
