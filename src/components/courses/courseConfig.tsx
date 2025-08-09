import {useTranslations} from 'next-intl';

import {ICourse} from '@/types/course';

export const getCourseDisplayName = (course: ICourse) => course.name;

export const useCreateCourseDetailsConfig = (
  course: ICourse | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (course: ICourse) => void;
  } = {},
) => {
  const { embedded = false, onEdit } = options;
  const t = useTranslations();
  const entityName = t('course', { defaultValue: 'Course' });
  return {
    name: entityName,
    route: '/courses',
    getDisplayName: getCourseDisplayName,
    getInitials: (course: ICourse) => course.name.charAt(0).toUpperCase(),
    item: course,
    loading,
    error,
    embedded,
    onEdit,
    fields: [
      { key: 'id', label: t('id') },
      { key: 'name', label: t('name') },
      { key: 'code', label: t('code') },
      { key: 'courseTypeId', label: t('courseType') },
      { key: 'scheduleTypeId', label: t('scheduleType') },
      { key: 'durationInSemesters', label: t('durationInSemesters') },
      { key: 'description', label: t('description') },
      { key: 'status', label: t('status') },
      { key: 'remarks', label: t('remarks') },
      {
        key: 'department.name',
        label: t('department'),
        render: (value: string, item: ICourse) => item?.department?.name || 'N/A',
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
