import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

import { ICourseAssignmentSubmission } from '@/types/courseAssignmentSubmission';

export const getCourseAssignmentSubmissionDisplayName = (
  courseAssignmentSubmission: ICourseAssignmentSubmission,
) =>
  `${courseAssignmentSubmission.assignment?.title} - ${courseAssignmentSubmission.student?.firstName} ${courseAssignmentSubmission.student?.lastName}`;

export const useCreateCourseAssignmentSubmissionDetailsConfig = (
  courseAssignmentSubmission: ICourseAssignmentSubmission | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (courseAssignmentSubmission: ICourseAssignmentSubmission) => void;
  } = {},
) => {
  const { embedded = false, onEdit } = options;
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT_SUBMISSION, {
    defaultValue: 'Course Assignment Submission',
  });
  return {
    name: entityName,
    route: '/course-assignment-submissions',
    getDisplayName: getCourseAssignmentSubmissionDisplayName,
    getInitials: (courseAssignmentSubmission: ICourseAssignmentSubmission) =>
      courseAssignmentSubmission.student?.firstName?.charAt(0).toUpperCase() || 'S',
    item: courseAssignmentSubmission,
    loading,
    error,
    embedded,
    onEdit,
    fields: [
      { key: 'id', label: t(LOCALE_KEYS.ID) },
      {
        key: 'assignment.title',
        label: t(LOCALE_KEYS.ASSIGNMENT),
        render: (value: string, item: ICourseAssignmentSubmission) =>
          item?.assignment?.title ? `${item.assignment.title} (${item.assignment.type})` : 'N/A',
      },
      {
        key: 'student.fullName',
        label: t(LOCALE_KEYS.STUDENT),
        render: (value: string, item: ICourseAssignmentSubmission) =>
          item?.student?.firstName ? `${item.student.firstName} (${item.student.applicationNo})` : 'N/A',
      },
      {
        key: 'submittedAt',
        label: t(LOCALE_KEYS.SUBMITTED_AT),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
      { key: 'remark', label: t(LOCALE_KEYS.REMARK) },
      {
        key: 'file.name',
        label: t(LOCALE_KEYS.FILE),
        render: (value: string, item: ICourseAssignmentSubmission) => item?.file?.fileName || 'N/A',
      },
      { key: 'marksObtained', label: t(LOCALE_KEYS.MARKS_OBTAINED) },
      { key: 'feedback', label: t(LOCALE_KEYS.FEEDBACK) },
      {
        key: 'grader.fullName',
        label: t(LOCALE_KEYS.GRADER),
        render: (value: string, item: ICourseAssignmentSubmission) =>
          item?.grader?.fullName ? `${item.grader.fullName} (${item.grader.employeeCode})` : 'N/A',
      },
      {
        key: 'gradedAt',
        label: t(LOCALE_KEYS.GRADED_AT),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
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
