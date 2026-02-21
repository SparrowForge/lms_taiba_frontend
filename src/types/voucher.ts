import { IVoucherType } from './voucherType';

// ============ AccVoucherDetailsChild (Sub-allocation) ============

export interface IAccVoucherDetailChild {
  id: number;
  voucherDetailId: number;
  refId?: number;
  costCenterId?: number;
  billNo?: string;
  amount: number;
  amountBase?: number;
  rate: number;
  currencyId?: number;
  refType?: number; // 1=Bill, 2=Advance
  remarks?: string;
  costCenter?: { id: number; costName: string };
}

export interface IAccVoucherDetailChildCreate {
  refId?: number;
  billNo?: string;
  amount: number;
  amountBase?: number;
  rate?: number;
  currencyId?: number;
  refType?: number;
  remarks?: string;
  costCenterId?: number;
}

// ============ AccVoucherDetails (Line Item) ============

export interface IAccVoucherDetail {
  id: number;
  voucherId: number;
  chartOfAccountId: number;
  costCenterId?: number;
  currencyId?: number;
  currencyExRate: number;
  debitAmount: number;
  creditAmount: number;
  lineNarration?: string;
  chequeNo?: string;
  chequeDate?: string;
  bankName?: string;
  bankAccno?: string;
  chartOfAccount?: {
    id: number;
    accountCode: string;
    accountName: string;
    isMultiCurrency: string;
  };
  costCenter?: { id: number; costName: string };
  children: IAccVoucherDetailChild[];
}

export interface IAccVoucherDetailCreate {
  chartOfAccountId: number;
  currencyId?: number;
  currencyExRate?: number;
  debitAmount?: number;
  creditAmount?: number;
  lineNarration?: string;
  chequeNo?: string;
  chequeDate?: string;
  bankName?: string;
  bankAccno?: string;
  costCenterId?: number;
  children?: IAccVoucherDetailChildCreate[];
}

// ============ AccVoucher (Header) ============

export interface IAccVoucher {
  id: number;
  voucherNo: string;
  voucherTypeId: number;
  voucherType?: IVoucherType;
  voucherDate: string;
  narration?: string;
  isPosted: number;
  financialYearId: number;
  branchId: number;
  departmentId?: number;
  fileName?: string;
  fileExt?: string;
  fileSize?: number;
  financialYear?: { id: number; yearName: string };
  branch?: { id: number; name: string };
  department?: { id: number; name: string };
  details: IAccVoucherDetail[];
  createdBy?: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt: string;
}

export interface IAccVoucherCreate {
  voucherNo?: string; // auto-generated if not provided
  voucherTypeId: number;
  voucherDate: string;
  narration?: string;
  isPosted?: number;
  financialYearId: number;
  branchId: number;
  departmentId?: number;
  details: IAccVoucherDetailCreate[];
}

export interface IAccVoucherUpdate extends Partial<IAccVoucherCreate> {}

// ============ Local State Types (for UI form management) ============

export interface IVoucherLineFormState {
  key: string; // UI-only key for React
  trType: 'DR' | 'CR';
  chartOfAccountId: number;
  chartOfAccountName?: string;
  currencyId?: number;
  currencyCode?: string;
  currAmount?: number;
  currRate: number;
  debitAmount: number;
  creditAmount: number;
  lineNarration?: string;
  costCenterId?: number;
  costCenterName?: string;
  chequeNo?: string;
  chequeDate?: string;
  bankName?: string;
  bankAccno?: string;
  children: IAccVoucherDetailChildCreate[];
}
