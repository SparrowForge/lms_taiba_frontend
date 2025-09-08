import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

import { IAttendance } from '@/types/attendance';

export const getAttendanceDisplayName = (attendance: IAttendance) =>
  `${attendance.course?.name} - ${attendance.subject?.name} - Class ${attendance.classNo}`;

export const useCreateAttendanceDetailsConfig = (
  attendance: IAttendance | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (attendance: IAttendance) => void;
  } = {},
) => {
  const { embedded = false, onEdit } = options;
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ATTENDANCE, { defaultValue: 'Attendance' });
  return {
    name: entityName,
    route: '/attendances',
    getDisplayName: getAttendanceDisplayName,
    getInitials: (attendance: IAttendance) =>
      attendance.course?.name?.charAt(0).toUpperCase() || 'A',
    item: attendance,
    loading,
    error,
    embedded,
    onEdit,
    fields: [
      { key: 'id', label: t(LOCALE_KEYS.ID) },
      {
        key: 'course.name',
        label: t(LOCALE_KEYS.COURSE),
        render: (value: string, item: IAttendance) =>
          item?.course?.name ? `${item.course.name} (${item.course.code})` : 'N/A',
      },
      {
        key: 'subject.name',
        label: t(LOCALE_KEYS.SUBJECT),
        render: (value: string, item: IAttendance) =>
          item?.subject?.name ? `${item.subject.name} (${item.subject.code})` : 'N/A',
      },
      {
        key: 'semester.name',
        label: t(LOCALE_KEYS.SEMESTER),
        render: (value: string, item: IAttendance) =>
          item?.semester?.name ? `${item.semester.name}` : 'N/A',
      },
      {
        key: 'batch.name',
        label: t(LOCALE_KEYS.BATCH),
        render: (value: string, item: IAttendance) =>
          item?.batch?.name ? `${item.batch.name}` : 'N/A',
      },
      {
        key: 'faculty.fullName',
        label: t(LOCALE_KEYS.FACULTY),
        render: (value: string, item: IAttendance) =>
          item?.faculty?.fullName
            ? `${item.faculty.fullName} (${item.faculty.employeeCode})`
            : 'N/A',
      },
      {
        key: 'schedule',
        label: t(LOCALE_KEYS.SCHEDULE),
        render: (value: string, item: IAttendance) =>
          item?.schedule
            ? `${item.schedule.subject?.name} - ${item.schedule.weekDay?.name}`
            : 'N/A',
      },
      { key: 'classNo', label: t(LOCALE_KEYS.CLASS_NO) },
      {
        key: 'date',
        label: t(LOCALE_KEYS.DATE),
        render: (value: string) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
      },
      { key: 'remarks', label: t(LOCALE_KEYS.REMARKS) },
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
