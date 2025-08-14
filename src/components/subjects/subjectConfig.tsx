import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

import {ISubject} from '@/types/subject';

export const getSubjectDisplayName = (subject: ISubject) => subject.name;

export const useCreateSubjectDetailsConfig = (
  subject: ISubject | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (subject: ISubject) => void;
  } = {},
) => {
  const { embedded = false, onEdit } = options;
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SUBJECT, { defaultValue: 'Subject' });
  return {
    name: entityName,
    route: '/subjects',
    getDisplayName: getSubjectDisplayName,
    getInitials: (subject: ISubject) => subject.name.charAt(0).toUpperCase(),
    item: subject,
    loading,
    error,
    embedded,
    onEdit,
    fields: [
      { key: 'id', label: t(LOCALE_KEYS.ID) },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'code', label: t(LOCALE_KEYS.CODE) },
      { key: 'creditHours', label: t(LOCALE_KEYS.CREDIT_HOURS) },
      { key: 'theoryHours', label: t(LOCALE_KEYS.THEORY_HOURS) },
      { key: 'practicalHours', label: t(LOCALE_KEYS.PRACTICAL_HOURS) },
      { key: 'description', label: t(LOCALE_KEYS.DESCRIPTION) },
      { key: 'prerequisite', label: t(LOCALE_KEYS.PREREQUISITE) },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
      { key: 'remarks', label: t(LOCALE_KEYS.REMARKS) },
      {
        key: 'course.name',
        label: t(LOCALE_KEYS.COURSE),
        render: (value: string, item: ISubject) => item?.course?.name || 'N/A',
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
