import {IBatch} from './batch';
import {ISemester} from './semester';

export interface IFeeStructure {
  id: number;
  templateName: string;
  batchId: number;
  semesterId: number;
  academicYear: string;
  paymentType: string;
  totalFees: string;
  admissionFee: string;
  discountType: string;
  discountAmount: string;
  currency: string;
  remarks: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  batch: IBatch;
  semester: ISemester;
}

export interface IFeeStructureCreate {
  templateName: string;
  batchId: number;
  semesterId: number;
  academicYear: string;
  paymentType: string;
  totalFees: string;
  admissionFee: string;
  discountType: string;
  discountAmount: string;
  currency: string;
  remarks: string;
  status: string;
}

export interface IFeeStructureUpdate {
  templateName?: string;
  batchId?: number;
  semesterId?: number;
  academicYear?: string;
  paymentType?: string;
  totalFees?: string;
  admissionFee?: string;
  discountType?: string;
  discountAmount?: string;
  currency?: string;
  remarks?: string;
  status?: string;
}
