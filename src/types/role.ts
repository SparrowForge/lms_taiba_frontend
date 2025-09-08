import { IBranch } from './branch';

export interface IRole {
  id: number;
  branchId: number;
  name: string;
  description: string;
  branch: IBranch;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IRoleCreate {
  branchId: number;
  name: string;
  description: string;
  status: string;
}

export interface IRoleUpdate {
  branchId?: number;
  name?: string;
  description?: string;
  status?: string;
}
