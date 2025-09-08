import { IBranch } from './branch';
import { IDepartment } from './department';

export interface IFaculty {
  id: number;
  branchId: number;
  departmentId: number;
  fullName: string;
  email: string;
  employeeCode: string;
  employmentType: string;
  isActive: boolean;
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  branch: IBranch;
  department: IDepartment;
}

export interface IFacultyCreate {
  branchId: number;
  departmentId: number;
  fullName: string;
  email: string;
  employeeCode: string;
  employmentType: string;
  isActive: boolean;
  joinedDate: string;
}

export interface IFacultyUpdate {
  branchId?: number;
  departmentId?: number;
  fullName?: string;
  email?: string;
  employeeCode?: string;
  employmentType?: string;
  isActive?: boolean;
  joinedDate?: string;
}

export interface IFacultyWithSubjectRole extends IFaculty {
  role: string;
  hoursPerWeek: number;
}
