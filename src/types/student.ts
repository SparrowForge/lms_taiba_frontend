import {IBatch} from './batch';
import {IBranch} from './branch';
import {ICourse} from './course';

export interface IStudent {
  id: number;
  applicationNo: string;
  name: string;
  cardNo: string;
  registrationNo: string;
  admissionDate: string;
  courseId: number;
  batchId: number;
  branchId: number;
  referenceNo: string;
  fileIds: number[];
  admissionSource: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course: ICourse;
  batch: IBatch;
  branch: IBranch;
}

export interface IStudentCreate {
  applicationNo: string;
  name: string;
  cardNo: string;
  registrationNo: string;
  admissionDate: string;
  courseId: number;
  batchId: number;
  branchId: number;
  referenceNo: string;
  fileIds: number[];
  admissionSource: string;
  status: string;
}

export interface IStudentUpdate {
  applicationNo?: string;
  name?: string;
  cardNo?: string;
  registrationNo?: string;
  admissionDate?: string;
  courseId?: number;
  batchId?: number;
  branchId?: number;
  referenceNo?: string;
  fileIds?: number[];
  admissionSource?: string;
  status?: string;
}
