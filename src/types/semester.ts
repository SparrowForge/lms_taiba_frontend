import {SemesterStatus} from '@/enums';

import {IBatch} from './batch';
import {ISubjectWithFaculty} from './subject';

export interface ISemester {
  id: number;
  batchId: number;
  name: string;
  termNo: number;
  startDate: string;
  endDate: string;
  status: SemesterStatus;
  remarks: string;
  isBreak: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  batch: IBatch;
}

export interface ISemesterCreate {
  batchId: number;
  name: string;
  termNo: number;
  startDate: string;
  endDate: string;
  status: SemesterStatus;
  remarks: string;
  isBreak: boolean;
}

export interface ISemesterUpdate {
  batchId?: number;
  name?: string;
  termNo?: number;
  startDate?: string;
  endDate?: string;
  status?: SemesterStatus;
  remarks?: string;
  isBreak?: boolean;
}

export interface ISemesterWithSubjectsAndFaculty extends ISemester {
  subjects: ISubjectWithFaculty[];
}
