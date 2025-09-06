/**
 * Institute related constants and types
 */

export const INSTITUTE_TYPES = {
  UNIVERSITY: 'University',
  COLLEGE: 'College',
  SCHOOL: 'School',
  INSTITUTE: 'Institute',
  ACADEMY: 'Academy',
  POLYTECHNIC: 'Polytechnic',
} as const;

export type InstituteType = (typeof INSTITUTE_TYPES)[keyof typeof INSTITUTE_TYPES];

export const INSTITUTE_TYPE_OPTIONS = Object.values(INSTITUTE_TYPES).map((type) => ({
  label: type,
  value: type,
}));
