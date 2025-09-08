import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { ISemesterSubject } from '@/types/semesterSubject';

export const getSemesterSubjectDisplayName = (semesterSubject: ISemesterSubject) => {
  return `${semesterSubject.semester?.name || 'Semester'} - ${semesterSubject.subject?.name || 'Subject'}`;
};

export const getSemesterSubjectInitials = (semesterSubject: ISemesterSubject) => {
  return `${semesterSubject.semester?.name?.slice(0, 1) || 'S'}${semesterSubject.subject?.name?.slice(0, 1) || 'S'}`;
};

export const useCreateSemesterSubjectDetailsConfig = (
  semesterSubject: ISemesterSubject | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (semesterSubject: ISemesterSubject) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<ISemesterSubject> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.SEMESTER_SUBJECT, { defaultValue: 'Semester Subject' }),
    route: '/semester-subjects',
    getDisplayName: getSemesterSubjectDisplayName,
    getInitials: getSemesterSubjectInitials,
    item: semesterSubject,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      {
        key: 'semester.name',
        label: t(LOCALE_KEYS.SEMESTER),
        render: (value: string, item: ISemesterSubject) => item?.semester?.name || 'N/A',
      },
      {
        key: 'subject.name',
        label: t(LOCALE_KEYS.SUBJECT),
        render: (value: string, item: ISemesterSubject) => item?.subject?.name || 'N/A',
      },
      {
        key: 'subject.code',
        label: t(LOCALE_KEYS.SUBJECT_CODE),
        render: (value: string, item: ISemesterSubject) => item?.subject?.code || 'N/A',
      },
      {
        key: 'subject.creditHours',
        label: t(LOCALE_KEYS.CREDIT_HOURS),
        render: (value: string, item: ISemesterSubject) => item?.subject?.creditHours || 'N/A',
      },
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
