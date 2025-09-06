import { IStatusOption } from '@/types/statusSelect';

export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other',
}

export enum FileCategory {
  PERSONAL = 'personal',
  ACADEMIC = 'academic',
  ADMINISTRATIVE = 'administrative',
  FINANCIAL = 'financial',
  LMS = 'lms',
  OTHER = 'other',
}

// Entity Status Options (Active/Inactive)
export const FILE_CATEGORY_OPTIONS: IStatusOption[] = Object.values(FileCategory).map((status) => ({
  key: `file_category_${status}`,
  value: status,
  labelKey: `file_category_${status}`,
}));

// Entity Status Options (Active/Inactive)
export const FILE_TYPE_OPTIONS: IStatusOption[] = Object.values(FileType).map((status) => ({
  key: `file_type_${status}`,
  value: status,
  labelKey: `file_type_${status}`,
}));
