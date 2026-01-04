import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import { ISection, ISectionCreate, ISectionUpdate } from '@/types/section';

import { api } from '@/lib/axios';

export const sectionService = {
  // Get all sections with pagination and search
  getSections: async (params = {}): Promise<IBasePaginatedResponse<ISection>> => {
    const response = await api.get<IBasePaginatedResponse<ISection>>('/sections', { params });
    return response.data;
  },

  // Get a single section by ID
  getSection: async (id: number): Promise<IBaseResponse<ISection>> => {
    const response = await api.get<IBaseResponse<ISection>>(`/sections/${id}`);
    return response.data;
  },

  // Create a new section
  createSection: async (data: ISectionCreate): Promise<ISection> => {
    const response = await api.post<ISection>('/sections', data);
    return response.data;
  },

  // Update an existing section
  updateSection: async (id: number, data: ISectionUpdate): Promise<ISection> => {
    const response = await api.patch<ISection>(`/sections/${id}`, data);
    return response.data;
  },

  // Delete a section
  deleteSection: async (id: number): Promise<void> => {
    const response = await api.delete(`/sections/${id}`);
    return response.data;
  },
};

