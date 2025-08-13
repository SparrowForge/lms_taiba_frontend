import {IFeeStructure} from './feeStructure';
import {ISemester} from './semester';

export interface IFeeInstallmentPlan {
  id: number;
  fee_structure_id: number;
  sequence_no: number;
  payment_label: string;
  semester_id: number;
  duration_months: number;
  amount: string;
  discount_amount: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  fee_structure: IFeeStructure;
  semester: ISemester;
}

export interface IFeeInstallmentPlanCreate {
  fee_structure_id: number;
  sequence_no: number;
  payment_label: string;
  semester_id: number;
  duration_months: number;
  amount: string;
  discount_amount: string;
  due_date: string;
}

export interface IFeeInstallmentPlanUpdate {
  sequence_no?: number;
  payment_label?: string;
  semester_id?: number;
  duration_months?: number;
  amount?: string;
  discount_amount?: string;
  due_date?: string;
}
