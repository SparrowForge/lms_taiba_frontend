export interface IFinancialYear {
  id: number;
  yearName: string;
  startDate: string; // Date string (YYYY-MM-DD)
  endDate: string; // Date string (YYYY-MM-DD)
  isClosed: number; // 0 = Open, 1 = Closed
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface IFinancialYearCreate {
  yearName: string;
  startDate: string; // Date string (YYYY-MM-DD)
  endDate: string; // Date string (YYYY-MM-DD)
  isClosed?: number;
}

export interface IFinancialYearUpdate extends Partial<IFinancialYearCreate> {
  id: number;
}
