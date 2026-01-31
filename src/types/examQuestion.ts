import { EntityStatus } from '@/enums/status';

import { IExam } from './exam';

export interface IDifficultyOption {
  label: string;
  value: 'easy' | 'medium' | 'hard';
}

export interface IExamQuestion {
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

export interface IExamQuestionMultiple {
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
  courseId: number;
  subjectId: number;
  difficultyLevel: IDifficultyOption;
}

export interface IExamQuestionCreate {
  examId: number;
  questionOrder: number;
  questionText: string;
  correctOptionNumber: number;
  options: string[];
  status: EntityStatus;
}

export interface IExamQuestionUpdate {
  examId?: number;
  questionOrder?: number;
  questionText?: string;
  correctOptionNumber?: number;
  options?: string[];
  status?: EntityStatus;
}

export interface IExamQuestionMultipleCreate {
  courseId: number;
  subjectId: number;
  questionText: string;
  correctOptionNumber: number;
  options: string[];
  status: EntityStatus;
  difficultyLevel: IDifficultyOption;
}
