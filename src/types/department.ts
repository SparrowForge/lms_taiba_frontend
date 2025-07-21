import {IBranch} from './branch';

export interface IDepartment {
  id: number;
  branchId: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  branch: IBranch;
}

export interface IDepartmentCreate {
  branchId: number;
  name: string;
  code: string;
}

export interface IDepartmentUpdate {
  branchId?: number;
  name?: string;
  code?: string;
}
