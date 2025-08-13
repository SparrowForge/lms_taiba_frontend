import {IBasePaginatedResponse, IBaseResponse} from '@/types/common';
import {IPanel} from '@/types/panel';

import {api} from '@/lib/axios';

export const panelService = {
  async getPanels(params = {}): Promise<IBasePaginatedResponse<IPanel>> {
    const response = await api.get<IBasePaginatedResponse<IPanel>>('/panels', { params });
    return response.data;
  },
  async getPanel(id: number): Promise<IBaseResponse<IPanel>> {
    const response = await api.get<IBaseResponse<IPanel>>(`/panels/${id}`);
    return response.data;
  },
  async createPanel(data: Partial<IPanel>): Promise<IPanel> {
    const response = await api.post<IPanel>('/panels', data);
    return response.data;
  },
  async updatePanel(id: number, data: Partial<IPanel>): Promise<IPanel> {
    const response = await api.patch<IPanel>(`/panels/${id}`, data);
    return response.data;
  },
  async deletePanel(id: number): Promise<void> {
    await api.delete(`/panels/${id}`);
  },
};
