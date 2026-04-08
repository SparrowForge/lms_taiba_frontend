import { api } from '@/lib/axios';

const BASE_URL = '/accounting/reports';

export interface ILedgerReportParams {
  accountId: number;
  fromDate: string;
  toDate: string;
  branchId?: number;
  status?: 'posted' | 'all';
}

export interface IBaseReportParams {
  fromDate: string;
  toDate: string;
  branchId?: number;
  status?: 'posted' | 'all';
}

export const accReportsService = {
  getLedger: async (params: ILedgerReportParams) => {
    const response = await api.get(`${BASE_URL}/ledger`, { params });
    return response.data;
  },

  getTrialBalance: async (params: IBaseReportParams) => {
    const response = await api.get(`${BASE_URL}/trial-balance`, { params });
    return response.data;
  },

  getIncomeStatement: async (params: IBaseReportParams) => {
    const response = await api.get(`${BASE_URL}/income-statement`, { params });
    return response.data;
  },

  getBalanceSheet: async (params: IBaseReportParams) => {
    const response = await api.get(`${BASE_URL}/balance-sheet`, { params });
    return response.data;
  },
};
