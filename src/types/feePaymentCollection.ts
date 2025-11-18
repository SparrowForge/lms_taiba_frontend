import { IFeePaymentDetails, IFeePaymentDetailsCreate } from './feePaymentDetails';
import { IFeeStructure } from './feeStructure';
import { IStudent } from './student';

export interface IFeePaymentCollection {
  id: number;
  studentId: number;
  feeStructureId: number;
  paymentDate: string;
  paymentMode: string;
  transactionRef: string;
  amountPaid: number;
  currency: string;
  status: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  student?: IStudent;
  feeStructure?: IFeeStructure;
  paymentDetails: IFeePaymentDetails[];
}

export interface IFeePaymentCollectionCreate {
  studentId: number;
  feeStructureId: number;
  paymentDate: string;
  paymentMode: string;
  transactionRef: string;
  amountPaid: number;
  currency: string;
  status: string;
  remarks?: string;
}

export interface IFeePaymentCollectionUpdate
  extends Omit<IFeePaymentCollectionCreate, 'studentId' | 'feeStructureId'> {}

export interface IFeePaymentCollectionBulk {
  paymentCollection: IFeePaymentCollectionCreate;
  paymentDetails: IFeePaymentDetailsCreate[];
}
