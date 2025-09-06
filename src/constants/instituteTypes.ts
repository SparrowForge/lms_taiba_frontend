export const INSTITUTE_TYPES = {
  UNIVERSITY: 'University',
  COLLEGE: 'College',
  ACADEMY: 'Academy',
  SCHOOL: 'School',
  INSTITUTE: 'Institute',
  POLYTECHNIC: 'Polytechnic',
  CONSERVATORY: 'Conservatory',
  SEMINARY: 'Seminary',
  TRAINING_CENTER: 'Training Center',
  RESEARCH_CENTER: 'Research Center',
  VOCATIONAL_SCHOOL: 'Vocational School',
  COMMUNITY_COLLEGE: 'Community College',
  TECHNICAL_INSTITUTE: 'Technical Institute',
  BUSINESS_SCHOOL: 'Business School',
  MEDICAL_SCHOOL: 'Medical School',
  LAW_SCHOOL: 'Law School',
  ART_SCHOOL: 'Art School',
  MUSIC_SCHOOL: 'Music School',
  MILITARY_ACADEMY: 'Military Academy',
  ONLINE_UNIVERSITY: 'Online University',
} as const;

export type InstituteType = (typeof INSTITUTE_TYPES)[keyof typeof INSTITUTE_TYPES];

export const INSTITUTE_TYPE_OPTIONS = Object.values(INSTITUTE_TYPES).map((type) => ({
  label: type,
  value: type,
}));
