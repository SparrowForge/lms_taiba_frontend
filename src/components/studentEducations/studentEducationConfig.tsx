import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IStudentEducation } from '@/types/studentEducation';

export const getStudentEducationDisplayName = (studentEducation: IStudentEducation) => {
  return studentEducation.degreeName || `Student Education #${studentEducation.id}`;
};

export const getStudentEducationInitials = (studentEducation: IStudentEducation) => {
  return studentEducation.degreeName?.slice(0, 2).toUpperCase() || 'SE';
};

export const useCreateStudentEducationDetailsConfig = (
  studentEducation: IStudentEducation | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (studentEducation: IStudentEducation) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IStudentEducation> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();

  return {
    name: t(LOCALE_KEYS.STUDENT_EDUCATION, { defaultValue: 'Student Education' }),
    route: '/student-educations',
    getDisplayName: getStudentEducationDisplayName,
    getInitials: getStudentEducationInitials,
    item: studentEducation,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'student.name', label: t(LOCALE_KEYS.STUDENT) },
      { key: 'degreeType', label: t(LOCALE_KEYS.DEGREE_TYPE) },
      { key: 'foundationCourse', label: t(LOCALE_KEYS.FOUNDATION_COURSE) },
      { key: 'degreeName', label: t(LOCALE_KEYS.DEGREE_NAME) },
      { key: 'passingYear', label: t(LOCALE_KEYS.PASSING_YEAR) },
      { key: 'institute', label: t(LOCALE_KEYS.INSTITUTE) },
      { key: 'result', label: t(LOCALE_KEYS.RESULT) },
      { key: 'groupMajor', label: t(LOCALE_KEYS.GROUP_MAJOR) },
      {
        key: 'createdAt',
        label: t(LOCALE_KEYS.CREATED_AT),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t(LOCALE_KEYS.UPDATED_AT),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
    ],
  };
};
