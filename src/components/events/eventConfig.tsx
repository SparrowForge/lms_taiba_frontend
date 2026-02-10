import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IEvent } from '@/types/event';

export const getEventDisplayName = (item: IEvent) => item.name || `Event #${item.id}`;

export const getEventInitials = (item: IEvent) =>
  item.name?.slice(0, 2).toUpperCase() || 'EV';

export const useCreateEventDetailsConfig = (
  item: IEvent | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (ev: IEvent) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IEvent> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.EVENT),
    route: '/events',
    getDisplayName: getEventDisplayName,
    getInitials: getEventInitials,
    item,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'academicYear', label: t(LOCALE_KEYS.ACADEMIC_YEAR) },
      {
        key: 'eventType.name',
        label: t(LOCALE_KEYS.EVENT_TYPE),
        render: (_: string, ev: IEvent) => ev?.eventTypeId ?? 'N/A',
      },
      { key: 'startAt', label: 'Start At' },
      { key: 'endAt', label: 'End At' },
      {
        key: 'branch.name',
        label: t(LOCALE_KEYS.BRANCH),
        render: (_: string, ev: IEvent) => ev?.branch?.name || 'N/A',
      },
      {
        key: 'course.name',
        label: t(LOCALE_KEYS.COURSE),
        render: (_: string, ev: IEvent) => ev?.course?.name || 'N/A',
      },
      {
        key: 'batch.name',
        label: t(LOCALE_KEYS.BATCH),
        render: (_: string, ev: IEvent) => ev?.batch?.name || 'N/A',
      },
      {
        key: 'semester.name',
        label: t(LOCALE_KEYS.SEMESTER),
        render: (_: string, ev: IEvent) => ev?.semester?.name || 'N/A',
      },
      { key: 'isAllDay', label: 'All Day' },
      { key: 'isHoliday', label: 'Holiday' },
      { key: 'isAffectsAttendance', label: 'Affects Attendance' },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
      { key: 'remarks', label: t(LOCALE_KEYS.REMARKS) },
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

