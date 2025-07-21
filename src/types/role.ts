import {IBranch} from './branch';

export interface IRole {
  id: number;
  branchId: number;
  name: string;
  description: string;
  branch: IBranch;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IRoleCreate {
  branchId: number;
  name: string;
  description: string;
}

export interface IRoleUpdate {
  branchId?: number;
  name?: string;
  description?: string;
}
