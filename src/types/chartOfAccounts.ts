export enum AccountType {
  ASSET = 'Asset',
  LIABILITY = 'Liability',
  EQUITY = 'Equity',
  INCOME = 'Income',
  EXPENSE = 'Expense',
}

export interface IChartOfAccount {
  id: number;
  parentId: number | null;
  parent?: IChartOfAccount | null;
  children?: IChartOfAccount[];
  accountCode: string;
  accountName: string;
  remarks?: string;
  accountType: string;
  isTransaction: boolean;
  isBank: boolean;
  isCash: boolean;
  currencyId?: number;
  level: number;
  status: string; // '0' | '1'
  isAdvance: string; // '0' | '1'
  suppressInBalanceSheet: string; // '0' | '1'
  isContra: string; // '0' | '1'
  costNo?: string;
  isChequeApplication: string; // '0' | '1'
  isMultiCurrency: string; // '0' | '1'
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  ipAddress?: string;
}

export interface IChartOfAccountCreate {
  parentId?: number;
  accountCode: string;
  accountName: string;
  remarks?: string;
  accountType: string;
  isTransaction?: boolean;
  isBank?: boolean;
  isCash?: boolean;
  currencyId?: number;
  level?: number;
  status?: string;
}

export interface IChartOfAccountUpdate extends Partial<IChartOfAccountCreate> {
  id: number;
}
