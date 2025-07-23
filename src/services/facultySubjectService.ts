import {api} from '@/lib/axios';
import {IFacultySubject, IFacultySubjectCreate, IFacultySubjectUpdate} from '@/types/facultySubject';
import {IBasePaginatedResponse} from '@/types/common';

export const facultySubjectService = {
  // Get all faculty subjects with pagination and search
  getFacultySubjects: async (params = {}): Promise<IBasePaginatedResponse<IFacultySubject>> => {
    const response = await api.get<IBasePaginatedResponse<IFacultySubject>>('/faculty-subjects', { params });
    return response.data;
  },

  // Get a single faculty subject by ID
  getFacultySubject: async (id: number): Promise<IFacultySubject> => {
    const response = await api.get<IFacultySubject>(`/faculty-subjects/${id}`);
    return response.data;
  },

  // Create a new faculty subject
  createFacultySubject: async (data: IFacultySubjectCreate): Promise<IFacultySubject> => {
    const response = await api.post<IFacultySubject>('/faculty-subjects', data);
    return response.data;
  },

  // Update an existing faculty subject
  updateFacultySubject: async (id: number, data: IFacultySubjectUpdate): Promise<IFacultySubject> => {
    const response = await api.put<IFacultySubject>(`/faculty-subjects/${id}`, data);
    return response.data;
  },

  // Delete a faculty subject
  deleteFacultySubject: async (id: number): Promise<void> => {
    const response = await api.delete(`/faculty-subjects/${id}`);
    return response.data;
  },
}; 