import {IBatch} from './batch';

export interface ISemester {
  id: number;
  batchId: number;
  name: string;
  termNo: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  batch: IBatch;
}

export interface ISemesterCreate {
  batchId: number;
  name: string;
  termNo: number;
  startDate: string;
  endDate: string;
}

export interface ISemesterUpdate {
  batchId?: number;
  name?: string;
  termNo?: number;
  startDate?: string;
  endDate?: string;
}
