import { EntityStatus } from '@/enums/status';

import { IExam } from './exam';

export interface IExamMCQQuestion {
  id: number;
  examId: number;
  questionOrder: number;
  questionText: string;
  correctOptionNumber: number;
  options: string[];
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  exam: IExam;
}

export interface IExamMCQQuestionCreate {
  examId: number;
  questionOrder: number;
  questionText: string;
  correctOptionNumber: number;
  options: string[];
  status: EntityStatus;
}

export interface IExamMCQQuestionUpdate {
  examId?: number;
  questionOrder?: number;
  questionText?: string;
  correctOptionNumber?: number;
  options?: string[];
  status?: EntityStatus;
}
