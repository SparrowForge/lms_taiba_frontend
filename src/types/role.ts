import { IBranch } from './branch';

export interface IRole {
  id: number;
  branchId: number;
  name: string;
  description: string;
  branch: IBranch;
  status: string;
  isHeadOfDepartment: boolean;
  isHeadOfHR: boolean;
  isHeadOfAccount: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


export interface IRoleCreate {
  branchId: number;
  name: string;
  description: string;
  status: string;
  isHeadOfDepartment: false,
  isHeadOfHR: false,
  isHeadOfAccount: false
}

export interface IRoleUpdate {
  branchId?: number;
  name?: string;
  description?: string;
  status?: string;
}
