import { IStatusOption } from '@/types/statusSelect';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum IdentityType {
  NID = 'nid',
  PASSPORT = 'passport',
  DRIVING_LICENSE = 'driving_license',
  OTHER = 'other',
}

export enum DegreeType {
  DIPLOMA = 'diploma',
  BACHELOR = 'bachelor',
  MASTERS = 'masters',
  PHD = 'phd',
  ASSOCIATE = 'associate',
  CERTIFICATE = 'certificate',
}

// Entity Status Options (Active/Inactive)
export const DEGREE_TYPE_OPTIONS: IStatusOption[] = Object.values(DegreeType).map((status) => ({
  key: `degree_type_${status}`,
  value: status,
  labelKey: `degree_type_${status}`,
}));

// Entity Status Options (Active/Inactive)
export const GENDER_OPTIONS: IStatusOption[] = Object.values(Gender).map((status) => ({
  key: `gender_${status}`,
  value: status,
  labelKey: `gender_${status}`,
}));

// Entity Status Options (Active/Inactive)
export const IDENTITY_TYPE_OPTIONS: IStatusOption[] = Object.values(IdentityType).map((status) => ({
  key: `identity_type_${status}`,
  value: status,
  labelKey: `identity_type_${status}`,
}));
