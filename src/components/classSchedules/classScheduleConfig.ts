import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';

import {IClassSchedule} from '@/types/classSchedule';

export const getClassScheduleDisplayName = (item: IClassSchedule) =>
  `${item.subject?.name || 'Subject'} - ${item.batch?.name || 'Batch'} (${item.weekDay?.name || 'Day'})`;
export const getClassScheduleInitials = (item: IClassSchedule) =>
  `${item.subject?.name?.slice(0, 1) || 'C'}${item.batch?.name?.slice(0, 1) || 'B'}`;

export const useCreateClassScheduleDetailsConfig = (
  item: IClassSchedule | null,
  loading: boolean,
  error: string | null,
  options: { embedded?: boolean; onEdit?: (cs: IClassSchedule) => void; onBack?: () => void } = {},
): EntityDetailsConfig<IClassSchedule> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.CLASS_SCHEDULE, { defaultValue: 'Class Schedule' }),
    route: '/class-schedules',
    getDisplayName: getClassScheduleDisplayName,
    getInitials: getClassScheduleInitials,
    item,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      {
        key: 'batch.name',
        label: t(LOCALE_KEYS.BATCH),
        render: (_, item) => item?.batch?.name || 'N/A',
      },
      {
        key: 'semester.name',
        label: t(LOCALE_KEYS.SEMESTER),
        render: (_, item) => item?.semester?.name || 'N/A',
      },
      {
        key: 'subject.name',
        label: t(LOCALE_KEYS.SUBJECT),
        render: (_, item) => item?.subject?.name || 'N/A',
      },
      {
        key: 'weekDay.name',
        label: t(LOCALE_KEYS.WEEK_DAY),
        render: (_, item) => item?.weekDay?.name || 'N/A',
      },
      {
        key: 'room.name',
        label: t(LOCALE_KEYS.ROOM),
        render: (_, item) => item?.room?.name || 'N/A',
      },
      {
        key: 'faculty.fullName',
        label: t(LOCALE_KEYS.FACULTY),
        render: (_, item) => item?.faculty?.fullName || 'N/A',
      },
      {
        key: 'timeSlot.name',
        label: t(LOCALE_KEYS.TIME_SLOT),
        render: (_, item) => item?.timeSlot?.name || 'N/A',
      },
      {
        key: 'startDate',
        label: t(LOCALE_KEYS.START_DATE),
        render: (v: string) => (v ? new Date(v).toLocaleDateString() : 'N/A'),
      },
      {
        key: 'endDate',
        label: t(LOCALE_KEYS.END_DATE),
        render: (v: string) => (v ? new Date(v).toLocaleDateString() : 'N/A'),
      },
      {
        key: 'isRecurring',
        label: t(LOCALE_KEYS.IS_RECURRING),
        render: (v: boolean) => (v ? t(LOCALE_KEYS.YES) : t(LOCALE_KEYS.NO)),
      },
      {
        key: 'classScheduleType',
        label: t(LOCALE_KEYS.CLASS_SCHEDULE_TYPE),
      },
      {
        key: 'maxCapacity',
        label: t(LOCALE_KEYS.MAX_CAPACITY),
      },
      {
        key: 'status',
        label: t(LOCALE_KEYS.STATUS),
      },
      {
        key: 'createdAt',
        label: t(LOCALE_KEYS.CREATED_AT),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t(LOCALE_KEYS.UPDATED_AT),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
    ],
  };
};
