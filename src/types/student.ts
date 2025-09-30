import { StudentStatus } from '@/enums';

import { IAddressCreate } from './address';
import { IBatch } from './batch';
import { IBranch } from './branch';
import { ICourse } from './course';
import { IFeePaymentCollection } from './feePaymentCollection';
import { IFeeStructure } from './feeStructure';
import { IStudentEducationCreate } from './studentEducation';
import { IStudentProfile, IStudentProfileCreate } from './studentProfile';

export interface IStudent {
  id: number;
  applicationNo: string;
  firstName: string;
  middleName: string;
  lastName: string;
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
  feeStructureId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course: ICourse;
  batch: IBatch;
  branch: IBranch;
  profile: IStudentProfile;
  feeStructure: IFeeStructure;
}

export interface IStudentCreate {
  applicationNo?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  cardNo?: string;
  registrationNo?: string;
  admissionDate: string;
  courseId: number;
  batchId: number;
  branchId: number;
  referenceNo?: string;
  fileIds: number[];
  admissionSource: string;
  status: StudentStatus;
  feeStructureId?: number;
}

export type IStudentUpdate = Omit<IStudentCreate, 'courseId' | 'batchId' | 'branchId'>

export interface IStudentRegistrationCreate {
  student: IStudentCreate;
  profile: IStudentProfileCreate;
  presentAddress: IAddressCreate;
  permanentAddress: IAddressCreate;
  educations: IStudentEducationCreate[];
}

export interface IFeePaymentSummary {
  totalDue: number;
  totalPaid: number;
  outstandingBalance: number;
  paymentCount: number;
  outstandingCount: number;
}

export interface IStudentWithFeeInfo {
  student: IStudent;
  feeStructure: IFeeStructure;
  paymentCollections: IFeePaymentCollection[];
  feeSummary: IFeePaymentSummary;
}
