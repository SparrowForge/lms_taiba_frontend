import {EntityStatus} from '@/enums';

import {ICourseType} from './courseType';
import {IDepartment} from './department';
import {IScheduleType} from './scheduleType';

export interface ICourse {
  id: number;
  departmentId: number;
  name: string;
  code: string;
  courseTypeId: number;
  scheduleTypeId: number;
  durationInSemesters: number;
  description: string;
  status: EntityStatus;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  department: IDepartment;
  courseType: ICourseType;
  scheduleType: IScheduleType;
}

export interface ICourseCreate {
  departmentId: number;
  name: string;
  code: string;
  courseTypeId: number;
  scheduleTypeId: number;
  durationInSemesters: number;
  description: string;
  status: EntityStatus;
  remarks: string;
}

export interface ICourseUpdate {
  departmentId?: number;
  name?: string;
  code?: string;
  courseTypeId?: number;
  scheduleTypeId?: number;
  durationInSemesters?: number;
  description?: string;
  status?: EntityStatus;
  remarks?: string;
}
