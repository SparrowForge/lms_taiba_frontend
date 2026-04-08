export interface FeePaymentDetailsRow {
  id: string;
  feeInstallmentPlanId: number;
  feeTitle: string;
  amountDue: number;
  amountPaid: number;
  balanceAmount: number;
  status: 'paid' | 'partial' | 'due';
  newAmountPaid?: number;
  newBalanceAmount?: number;
}
