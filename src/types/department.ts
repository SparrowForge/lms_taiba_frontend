import { IBranch } from './branch';
import { IFaculty } from './faculty';

export interface IDepartment {
  id: number;
  branchId: number;
  name: string;
  code: string;
  headId: number;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  branch: IBranch;
  head: IFaculty | null;
}

export interface IDepartmentCreate {
  branchId: number;
  name: string;
  code: string;
  headId: number;
  email: string;
  phone: string;
  status: string;
}

export interface IDepartmentUpdate {
  branchId?: number;
  name?: string;
  code?: string;
  headId?: number;
  email?: string;
  phone?: string;
  status?: string;
}
