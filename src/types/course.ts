import {IDepartment} from './department';

export interface ICourse {
  id: number;
  departmentId: number;
  name: string;
  code: string;
  courseType: string;
  durationInSemesters: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  department: IDepartment;
}

export interface ICourseCreate {
  departmentId: number;
  name: string;
  code: string;
  courseType: string;
  durationInSemesters: number;
  description: string;
}

export interface ICourseUpdate {
  departmentId?: number;
  name?: string;
  code?: string;
  courseType?: string;
  durationInSemesters?: number;
  description?: string;
}
