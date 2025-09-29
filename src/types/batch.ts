import {EntityStatus} from '@/enums';

import {ICourse} from './course';
import {ISemesterCreate, ISemesterUpdate} from './semester';

export interface IBatch {
  id: number;
  courseId: number;
  name: string;
  code: string;
  academicYear: number;
  session: string;
  intakeCapacity: number;
  startDate: string;
  endDate: string;
  status: EntityStatus;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course: ICourse;
}

export interface IBatchCreate {
  courseId: number;
  name: string;
  code: string;
  academicYear: number;
  session: string;
  intakeCapacity: number;
  startDate: string;
  endDate: string;
  status: EntityStatus;
  remarks: string;
}

export interface IBatchUpdate {
  courseId?: number;
  name?: string;
  code?: string;
  academicYear?: number;
  session?: string;
  intakeCapacity?: number;
  startDate?: string;
  endDate?: string;
  status?: EntityStatus;
  remarks?: string;
}

// New interface for creating batch with semesters
export interface IBatchWithSemestersCreate {
  batch: IBatchCreate;
  semesters: Omit<ISemesterCreate, 'batchId'>[];
}

// New interface for updating batch with semesters
export interface IBatchWithSemestersUpdate {
  batch: IBatchUpdate;
  semesters: ISemesterUpdate[];
}
