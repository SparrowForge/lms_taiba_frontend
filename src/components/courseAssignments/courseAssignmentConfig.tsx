import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

import { ICourseAssignment } from '@/types/courseAssignment';

export const getCourseAssignmentDisplayName = (courseAssignment: ICourseAssignment) =>
  courseAssignment.title;

export const useCreateCourseAssignmentDetailsConfig = (
  courseAssignment: ICourseAssignment | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (courseAssignment: ICourseAssignment) => void;
  } = {},
) => {
  const { embedded = false, onEdit } = options;
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT, { defaultValue: 'Course Assignment' });
  return {
    name: entityName,
    route: '/course-assignments',
    getDisplayName: getCourseAssignmentDisplayName,
    getInitials: (courseAssignment: ICourseAssignment) =>
      courseAssignment.title.charAt(0).toUpperCase(),
    item: courseAssignment,
    loading,
    error,
    embedded,
    onEdit,
    fields: [
      { key: 'id', label: t(LOCALE_KEYS.ID) },
      { key: 'title', label: t(LOCALE_KEYS.TITLE) },
      { key: 'description', label: t(LOCALE_KEYS.DESCRIPTION) },
      { key: 'type', label: t(LOCALE_KEYS.TYPE) },
      { key: 'totalMarks', label: t(LOCALE_KEYS.TOTAL_MARKS) },
      { key: 'passMarks', label: t(LOCALE_KEYS.PASS_MARKS) },
      { key: 'maxAttempts', label: t(LOCALE_KEYS.MAX_ATTEMPTS) },
      {
        key: 'publishDate',
        label: t(LOCALE_KEYS.PUBLISH_DATE),
        render: (value: string) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
      },
      {
        key: 'dueDate',
        label: t(LOCALE_KEYS.DUE_DATE),
        render: (value: string) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
      },
      {
        key: 'allowLateSubmit',
        label: t(LOCALE_KEYS.ALLOW_LATE_SUBMIT),
        render: (value: boolean) => (value ? t(LOCALE_KEYS.YES) : t(LOCALE_KEYS.NO)),
      },
      {
        key: 'latePenalty',
        label: t(LOCALE_KEYS.LATE_PENALTY),
        render: (value: number | null) => (value ? `${value}%` : 'N/A'),
      },
      {
        key: 'attachmentPath',
        label: t(LOCALE_KEYS.ATTACHMENT_PATH),
        render: (value: string | null) => value || 'N/A',
      },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
      {
        key: 'course.name',
        label: t(LOCALE_KEYS.COURSE),
        render: (value: string, item: ICourseAssignment) =>
          item?.course?.name ? `${item.course.name} (${item.course.code})` : 'N/A',
      },
      {
        key: 'subject.name',
        label: t(LOCALE_KEYS.SUBJECT),
        render: (value: string, item: ICourseAssignment) =>
          item?.subject?.name ? `${item.subject.name} (${item.subject.code})` : 'N/A',
      },
      {
        key: 'semester.name',
        label: t(LOCALE_KEYS.SEMESTER),
        render: (value: string, item: ICourseAssignment) =>
          item?.semester?.name ? `${item.semester.name}` : 'N/A',
      },
      {
        key: 'batch.name',
        label: t(LOCALE_KEYS.BATCH),
        render: (value: string, item: ICourseAssignment) =>
          item?.batch?.name ? `${item.batch.name}` : 'N/A',
      },
      {
        key: 'faculty.fullName',
        label: t(LOCALE_KEYS.FACULTY),
        render: (value: string, item: ICourseAssignment) =>
          item?.faculty?.fullName
            ? `${item.faculty.fullName} (${item.faculty.employeeCode})`
            : 'N/A',
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
