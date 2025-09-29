import {StudentStatus} from '@/enums';

import {IAddressCreate} from './address';
import {IBatch} from './batch';
import {IBranch} from './branch';
import {ICourse} from './course';
import {IStudentEducationCreate} from './studentEducation';
import {IStudentProfile, IStudentProfileCreate} from './studentProfile';

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
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course: ICourse;
  batch: IBatch;
  branch: IBranch;
  profile: IStudentProfile;
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
  status: StudentStatus;
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
  status?: StudentStatus;
}

export interface IStudentRegistrationCreate {
  student: IStudentCreate;
  profile: IStudentProfileCreate;
  presentAddress: IAddressCreate;
  permanentAddress: IAddressCreate;
  educations: IStudentEducationCreate[];
}
