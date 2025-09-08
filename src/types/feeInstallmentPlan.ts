import { IFeeStructure } from './feeStructure';
import { ISemester } from './semester';

export interface IFeeInstallmentPlan {
  id: number;
  feeStructureId: number;
  sequenceNo: number;
  paymentLabel: string;
  semesterId: number;
  durationMonths: number;
  amount: number;
  discountAmount: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  feeStructure: IFeeStructure;
  semester: ISemester;
}

export interface IFeeInstallmentPlanCreate {
  feeStructureId: number;
  sequenceNo: number;
  paymentLabel: string;
  semesterId: number;
  durationMonths: number;
  amount: number;
  discountAmount: number;
  dueDate: string;
}

export interface IFeeInstallmentPlanUpdate {
  sequenceNo?: number;
  paymentLabel?: string;
  semesterId?: number;
  durationMonths?: number;
  amount?: number;
  discountAmount?: number;
  dueDate?: string;
}
