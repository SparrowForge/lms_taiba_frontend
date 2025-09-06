import { IStatusOption } from '@/types/statusSelect';

export enum MaterialType {
  DOCUMENT = 'document',
  VIDEO = 'video',
  LINK = 'link',
  AUDIO = 'audio',
  IMAGE = 'image',
  OTHER = 'other',
}

export enum AccessLevelType {
  STUDENT = 'student',
  FACULTY = 'faculty',
  ADMIN = 'admin',
  PUBLIC = 'public',
}

// Entity Status Options (Active/Inactive)
export const ACCESS_LEVEL_TYPE_OPTIONS: IStatusOption[] = Object.values(AccessLevelType).map(
  (status) => ({
    key: `access_level_type_${status}`,
    value: status,
    labelKey: `access_level_type_${status}`,
  }),
);

// Entity Status Options (Active/Inactive)
export const MATERIAL_TYPE_OPTIONS: IStatusOption[] = Object.values(MaterialType).map((status) => ({
  key: `material_type_${status}`,
  value: status,
  labelKey: `material_type_${status}`,
}));
