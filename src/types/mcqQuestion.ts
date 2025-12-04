import { DifficultyLevel } from '@/enums/difficulty-level.enum';
import { EntityStatus } from '@/enums/status';

import { ICourse } from './course';
import { IFaculty } from './faculty';
import { ISubject } from './subject';

export interface IMCQQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctOptionNumber: string;
  courseId: number;
  subjectId: number;
  facultyId: number;
  difficultyLevel: DifficultyLevel;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course?: ICourse;
  subject?: ISubject;
  faculty?: IFaculty;
}

export interface IMCQQuestionCreate {
  questionText: string;
  options: string[];
  correctOptionNumber: string;
  courseId: number;
  subjectId: number;
  facultyId: number;
  difficultyLevel: DifficultyLevel;
  status: EntityStatus;
}

export interface IMCQQuestionUpdate {
  questionText?: string;
  options?: string[];
  correctOptionNumber?: string;
  courseId?: number;
  subjectId?: number;
  facultyId?: number;
  difficultyLevel?: DifficultyLevel;
  status?: EntityStatus;
}

export interface IMCQQuestionBulkCreate {
  questions: IMCQQuestionCreate[];
}

