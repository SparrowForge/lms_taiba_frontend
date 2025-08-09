import {useTranslations} from 'next-intl';

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
  const t = useTranslations();
  const entityName = t('subject', { defaultValue: 'Subject' });
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
      { key: 'id', label: t('id') },
      { key: 'name', label: t('name') },
      { key: 'code', label: t('code') },
      { key: 'creditHours', label: t('creditHours') },
      { key: 'theoryHours', label: t('theoryHours') },
      { key: 'practicalHours', label: t('practicalHours') },
      { key: 'description', label: t('description') },
      { key: 'prerequisite', label: t('prerequisite') },
      { key: 'status', label: t('status') },
      { key: 'remarks', label: t('remarks') },
      {
        key: 'course.name',
        label: t('course'),
        render: (value: string, item: ISubject) => item?.course?.name || 'N/A',
      },
      {
        key: 'createdAt',
        label: t('createdAt'),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t('updatedAt'),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
    ],
  };
};
