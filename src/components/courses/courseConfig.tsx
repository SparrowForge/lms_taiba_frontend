import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE, { defaultValue: 'Course' });
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
      { key: 'id', label: t(LOCALE_KEYS.ID) },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'code', label: t(LOCALE_KEYS.CODE) },
      {
        key: 'courseType.name',
        label: t(LOCALE_KEYS.COURSE_TYPE),
        render: (value: string, item: ICourse) => item?.courseType?.name || 'N/A',
      },
      {
        key: 'scheduleType.name',
        label: t(LOCALE_KEYS.SCHEDULE_TYPE),
        render: (value: string, item: ICourse) => item?.scheduleType?.name || 'N/A',
      },
      { key: 'durationInSemesters', label: t(LOCALE_KEYS.DURATION_IN_SEMESTERS) },
      { key: 'description', label: t(LOCALE_KEYS.DESCRIPTION) },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
      { key: 'remarks', label: t(LOCALE_KEYS.REMARKS) },
      {
        key: 'department.name',
        label: t(LOCALE_KEYS.DEPARTMENT),
        render: (value: string, item: ICourse) => item?.department?.name || 'N/A',
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
