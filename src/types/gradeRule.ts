import { EntityStatus } from '@/enums/status';

import { ICourse } from './course';

export interface IGradeRule {
  id: number;
  grade: string;
  courseId: number | null;
  minMarks: number;
  maxMarks: number;
  gradePoint: number;
  remarks: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course: ICourse;
}

export interface IGradeRuleCreate {
  grade: string;
  courseId?: number | null;
  minMarks: number;
  maxMarks: number;
  gradePoint: number;
  remarks: string;
  status: EntityStatus;
}

export interface IGradeRuleUpdate {
  grade?: string;
  courseId?: number | null;
  minMarks?: number;
  maxMarks?: number;
  gradePoint?: number;
  remarks?: string;
  status?: EntityStatus;
}
