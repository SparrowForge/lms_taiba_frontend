import { IBatch } from './batch';
import { ISemester } from './semester';

export interface IFeeStructure {
  id: number;
  template_name: string;
  batch_id: number;
  semester_id: number;
  academic_year: string;
  payment_type: string;
  total_fees: string;
  admission_fee: string;
  discount_type: string;
  discount_amount: string;
  currency: string;
  remarks: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  batch: IBatch;
  semester: ISemester;
}

export interface IFeeStructureCreate {
  template_name: string;
  batch_id: number;
  semester_id: number;
  academic_year: string;
  payment_type: string;
  total_fees: string;
  admission_fee: string;
  discount_type: string;
  discount_amount: string;
  currency: string;
  remarks: string;
  status: string;
}

export interface IFeeStructureUpdate {
  template_name?: string;
  batch_id?: number;
  semester_id?: number;
  academic_year?: string;
  payment_type?: string;
  total_fees?: string;
  admission_fee?: string;
  discount_type?: string;
  discount_amount?: string;
  currency?: string;
  remarks?: string;
  status?: string;
}
