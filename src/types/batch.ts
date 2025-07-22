import { ICourse } from './course';

export interface IBatch {
  id: number;
  courseId: number;
  name: string;
  year: number;
  session: string;
  intakeCapacity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course: ICourse;
}

export interface IBatchCreate {
  courseId: number;
  name: string;
  year: number;
  session: string;
  intakeCapacity: number;
}

export interface IBatchUpdate {
  courseId?: number;
  name?: string;
  year?: number;
  session?: string;
  intakeCapacity?: number;
} 