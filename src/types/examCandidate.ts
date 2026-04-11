import { EntityStatus } from '@/enums/status';

import { IExam } from './exam';
import { IStudent } from './student';

export interface IExamCandidate {
  id: number;
  examId: number;
  studentId: number;
  rollNo: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  student: IStudent;
  exam: IExam;
}

export interface IExamCandidateCreate {
  examId: number;
  studentId: number;
  rollNo: string;
  status: EntityStatus;
}

export interface IExamCandidateUpdate {
  examId?: number;
  studentId?: number;
  rollNo?: string;
  status?: EntityStatus;
}

export interface IExamCandidateBulkItem {
  studentId: number;
  // rollNo: string;
  status: EntityStatus;
}

export interface ICreateExamCandidateBulk {
  examId: number;
  candidates: IExamCandidateBulkItem[];
}


// types/examCandidate.ts

export interface ICreateExamCandidateBulkResponse {
  removedCount: number;
  createdCount: number;
  candidates: IExamCandidate[];
}
