import { ICourse } from './course';

export interface ISubject {
  id: number;
  courseId: number;
  name: string;
  code: string;
  creditHours: string;
  theoryHours: number;
  practicalHours: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course: ICourse;
}

export interface ISubjectCreate {
  courseId: number;
  name: string;
  code: string;
  creditHours: string;
  theoryHours: number;
  practicalHours: number;
  description: string;
}

export interface ISubjectUpdate {
  courseId?: number;
  name?: string;
  code?: string;
  creditHours?: string;
  theoryHours?: number;
  practicalHours?: number;
  description?: string;
} 