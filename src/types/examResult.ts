import { EntityStatus } from '@/enums/status';

import { IExam } from './exam';
import { IStudent } from './student';

export interface IExamResult {
  id: number;
  examId: number;
  studentId: number;
  marksObtained: number;
  grade: string;
  remarks: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  student: IStudent;
  exam: IExam;
}

export interface IExamResultCreate {
  examId: number;
  studentId: number;
  marksObtained: number;
  grade: string;
  remarks: string;
  status: EntityStatus;
}

export interface IExamResultUpdate {
  examId?: number;
  studentId?: number;
  marksObtained?: number;
  grade?: string;
  remarks?: string;
  status?: EntityStatus;
}
