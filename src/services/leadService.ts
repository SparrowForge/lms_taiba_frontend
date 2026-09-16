import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  ILead,
  ILeadActivity,
  ILeadActivityCreate,
  ILeadAssign,
  ILeadConvert,
  ILeadCreate,
  ILeadFunnelStats,
  ILeadSource,
  ILeadStageUpdate,
  ILeadUpdate,
} from '@/types/lead';

import { api } from '@/lib/axios';

export const leadService = {
  // --- CRUD ---------------------------------------------------------------

  getLeads: async (params = {}): Promise<IBasePaginatedResponse<ILead>> => {
    const response = await api.get<IBasePaginatedResponse<ILead>>('/leads', {
      params,
    });
    return response.data;
  },

  getLead: async (id: number): Promise<IBaseResponse<ILead>> => {
    const response = await api.get<IBaseResponse<ILead>>(`/leads/${id}`);
    return response.data;
  },

  createLead: async (data: ILeadCreate): Promise<IBaseResponse<ILead>> => {
    const response = await api.post<IBaseResponse<ILead>>('/leads', data);
    return response.data;
  },

  updateLead: async (id: number, data: ILeadUpdate): Promise<IBaseResponse<ILead>> => {
    const response = await api.patch<IBaseResponse<ILead>>(`/leads/${id}`, data);
    return response.data;
  },

  deleteLead: async (id: number): Promise<void> => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },

  // --- pipeline -----------------------------------------------------------

  updateStage: async (id: number, data: ILeadStageUpdate): Promise<IBaseResponse<ILead>> => {
    const response = await api.patch<IBaseResponse<ILead>>(`/leads/${id}/stage`, data);
    return response.data;
  },

  assignLead: async (id: number, data: ILeadAssign): Promise<IBaseResponse<ILead>> => {
    const response = await api.patch<IBaseResponse<ILead>>(`/leads/${id}/assign`, data);
    return response.data;
  },

  bulkAssign: async (
    leadIds: number[],
    assignedToUserId: number | null,
  ): Promise<IBaseResponse<{ updated: number }>> => {
    const response = await api.patch<IBaseResponse<{ updated: number }>>('/leads/assign/bulk', {
      leadIds,
      assignedToUserId,
    });
    return response.data;
  },

  convertLead: async (
    id: number,
    data: ILeadConvert,
  ): Promise<IBaseResponse<{ lead: ILead; student: { id: number } }>> => {
    const response = await api.post<IBaseResponse<{ lead: ILead; student: { id: number } }>>(
      `/leads/${id}/convert`,
      data,
    );
    return response.data;
  },

  // --- timeline -----------------------------------------------------------

  getActivities: async (
    leadId: number,
    params = {},
  ): Promise<IBasePaginatedResponse<ILeadActivity>> => {
    const response = await api.get<IBasePaginatedResponse<ILeadActivity>>(
      `/leads/${leadId}/activities`,
      { params },
    );
    return response.data;
  },

  addActivity: async (
    leadId: number,
    data: ILeadActivityCreate,
  ): Promise<IBaseResponse<ILeadActivity>> => {
    const response = await api.post<IBaseResponse<ILeadActivity>>(
      `/leads/${leadId}/activities`,
      data,
    );
    return response.data;
  },

  deleteActivity: async (activityId: number): Promise<void> => {
    const response = await api.delete(`/leads/activities/${activityId}`);
    return response.data;
  },

  // --- reporting and helpers ---------------------------------------------

  getFunnelStats: async (params = {}): Promise<IBaseResponse<ILeadFunnelStats>> => {
    const response = await api.get<IBaseResponse<ILeadFunnelStats>>('/leads/stats/funnel', {
      params,
    });
    return response.data;
  },

  getDueFollowUps: async (params = {}): Promise<IBaseResponse<ILead[]>> => {
    const response = await api.get<IBaseResponse<ILead[]>>('/leads/follow-ups/due', {
      params,
    });
    return response.data;
  },

  checkDuplicate: async (
    email?: string,
    phone?: string,
  ): Promise<IBaseResponse<{ duplicate: ILead | null }>> => {
    const response = await api.get<IBaseResponse<{ duplicate: ILead | null }>>(
      '/leads/duplicates/check',
      { params: { email, phone } },
    );
    return response.data;
  },

  // --- lead sources -------------------------------------------------------

  getLeadSources: async (params = {}): Promise<IBasePaginatedResponse<ILeadSource>> => {
    const response = await api.get<IBasePaginatedResponse<ILeadSource>>('/lead-sources', {
      params,
    });
    return response.data;
  },
};
