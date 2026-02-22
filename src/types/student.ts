import {StudentStatus} from '@/enums';

import {IAddressCreate} from './address';
import {IBatch} from './batch';
import {IBranch} from './branch';
import {ICourse} from './course';
import {IFeePaymentCollection} from './feePaymentCollection';
import {IFeeStructure} from './feeStructure';
import {ISemester} from './semester';
import {IStudentEducationCreate} from './studentEducation';
import {IStudentProfile, IStudentProfileCreate} from './studentProfile';
import {ISubjectWithFaculty} from './subject';
import { IExamResult, ISubjectResult } from './examResult';
import { IAttendance } from './attendance';

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
  course: ICourse | null;
  batch: IBatch | null;
  branch: IBranch | null;
  profile: IStudentProfile | null;
  feeStructure: IFeeStructure | null;
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

export type IStudentUpdate = Omit<IStudentCreate, 'courseId' | 'batchId' | 'branchId'>;

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

export interface IStudentDashboard {
  student: IStudent;
  batch: IBatch;
  course: ICourse;
  currentSemester?: any;
  upcomingClasses?: any[];
  recentAttendance?: any[];
  grades?: any[];
  announcements?: any[];
  feeSummary?: IFeePaymentSummary;
}

export interface IStudentSubjects {
  semester: ISemester;
  subjects: ISubjectWithFaculty[];
}


export interface IStudentSemesterResultFinalization {
  student: IStudent
  subjectResult: ISubjectResult | null
  examResults: IExamResult[]
  attendance: IAttendance[]
}