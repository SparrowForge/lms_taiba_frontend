import { api } from '@/lib/axios';
import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { IAccVoucher, IAccVoucherCreate, IAccVoucherUpdate } from '@/types/voucher';

const BASE_URL = '/accounting/vouchers';

export const voucherService = {
  // Get all vouchers (paginated)
  getAll: async (
    params: {
      page?: number;
      limit?: number;
      voucherTypeId?: number;
      dateFrom?: string;
      dateTo?: string;
      financialYearId?: number;
      branchId?: number;
      departmentId?: number;
      chartOfAccountId?: number;
      costCenterId?: number;
      voucherNo?: string;
      isPosted?: number;
    } = {},
  ): Promise<IBasePaginatedResponse<IAccVoucher>> => {
    const response = await api.get<IBasePaginatedResponse<IAccVoucher>>(BASE_URL, { params });
    return response.data;
  },

  // Get a single voucher by ID
  getById: async (id: number): Promise<IBaseResponse<IAccVoucher>> => {
    const response = await api.get<IBaseResponse<IAccVoucher>>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Create a new voucher
  create: async (data: IAccVoucherCreate): Promise<IBaseResponse<IAccVoucher>> => {
    const response = await api.post<IBaseResponse<IAccVoucher>>(BASE_URL, data);
    return response.data;
  },

  // Update an existing voucher
  update: async (id: number, data: IAccVoucherUpdate): Promise<IBaseResponse<IAccVoucher>> => {
    const response = await api.patch<IBaseResponse<IAccVoucher>>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Delete a voucher
  delete: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // Get next auto-generated voucher number
  getNextNumber: async (voucherTypeId: number): Promise<IBaseResponse<{ voucherNo: string }>> => {
    const response = await api.get<IBaseResponse<{ voucherNo: string }>>(
      `${BASE_URL}/next-number`,
      {
        params: { voucherTypeId },
      },
    );
    return response.data;
  },
};
