import {IAudit} from '@/types/audit';
import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';

import {api} from '@/lib/axios';

export const auditService = {
  // Get all audit logs with pagination and search
  getAudit: async (params = {}): Promise<IBasePaginatedResponse<IAudit>> => {
    const response = await api.get<IBasePaginatedResponse<IAudit>>('/audit', { params });
    return response.data;
  },

  // Get a single audit log by ID
  getAuditById: async (id: number): Promise<IBaseResponse<IAudit>> => {
    const response = await api.get<IBaseResponse<IAudit>>(`/audit/${id}`);
    return response.data;
  },

  //Get audit logs by resource/resourceId
  getAuditByResource: async (
    resource: string,
    resourceId: number,
    params = {},
  ): Promise<IBasePaginatedResponse<IAudit>> => {
    const response = await api.get<IBasePaginatedResponse<IAudit>>(
      `/audit/resource/${resource}?resourceId=${resourceId}&action=UPDATE`,
      { params },
    );
    return response.data;
  },
  // Clean/delete audit logs
  cleanAudit: async (params = {}): Promise<void> => {
    const response = await api.delete('/audit', { params });
    return response.data;
  },
};
