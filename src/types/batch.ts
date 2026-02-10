import { EntityStatus } from '@/enums';

import { ICourse } from './course';
import { ISemester, ISemesterCreate, ISemesterUpdate } from './semester';
import { ISectionCreate } from './section';

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
  semesters?: ISemester[];
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

// New interface for creating batch with semesters and optional sections
export interface IBatchWithSemestersCreate {
  batch: IBatchCreate;
  semesters: Omit<ISemesterCreate, 'batchId'>[];
  sections: Omit<ISectionCreate, 'batchId'>[];
}

// New interface for updating batch with semesters
export interface IBatchWithSemestersUpdate {
  batch: IBatchUpdate;
  semesters: ISemesterUpdate[];
}
