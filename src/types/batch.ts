import {ICourse} from './course';

export interface IBatch {
  id: number;
  courseId: number;
  name: string;
  year: number;
  session: string;
  intakeCapacity: number;
  startDate: string;
  endDate: string;
  status: string;
  remarks: string;
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
  startDate: string;
  endDate: string;
  status: string;
  remarks: string;
}

export interface IBatchUpdate {
  courseId?: number;
  name?: string;
  year?: number;
  session?: string;
  intakeCapacity?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  remarks?: string;
}
