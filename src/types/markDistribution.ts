import { EntityStatus } from '@/enums/status';

import { ICourse } from './course';
import { IExamType } from './examType';
import { ISubject } from './subject';

export interface IMarkDistribution {
  id: number;
  courseId: number;
  subjectId: number;
  examTypeId: number;
  weightage: number;
  maxMarks: number;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course: ICourse;
  subject: ISubject;
  examType: IExamType;
}

export interface IMarkDistributionCreate {
  courseId: number;
  subjectId: number;
  examTypeId: number;
  weightage: number;
  maxMarks: number;
  status: EntityStatus;
}

export interface IMarkDistributionUpdate {
  courseId?: number;
  subjectId?: number;
  examTypeId?: number;
  weightage?: number;
  maxMarks?: number;
  status?: EntityStatus;
}
