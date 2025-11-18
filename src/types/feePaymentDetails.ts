import {IFeeInstallmentPlan} from './feeInstallmentPlan';

export interface IFeePaymentDetails {
  id: number;
  paymentId: number;
  feeInstallmentPlanId: number;
  feeTitle: string;
  amountDue: number;
  amountPaid: number;
  balanceAmount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  feeInstallmentPlan?: IFeeInstallmentPlan;
}

export interface IFeePaymentDetailsCreate {
  paymentId: number;
  feeInstallmentPlanId: number;
  feeTitle: string;
  amountDue: number;
  amountPaid: number;
  balanceAmount: number;
}

export type IFeePaymentDetailsUpdate = Omit<
  IFeePaymentDetailsCreate,
  'paymentId' | 'feeInstallmentPlanId'
>;
