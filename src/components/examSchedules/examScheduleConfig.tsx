import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IExamSchedule } from '@/types/examSchedule';

export const getExamScheduleDisplayName = (examSchedule: IExamSchedule) => {
  return (
    `${examSchedule.exam?.name || 'Exam'} - ${examSchedule.room?.name || 'Room'}` ||
    `Exam Schedule #${examSchedule.id}`
  );
};

export const getExamScheduleInitials = (examSchedule: IExamSchedule) => {
  return 'ES';
};

export const useCreateExamScheduleDetailsConfig = (
  examSchedule: IExamSchedule | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (examSchedule: IExamSchedule) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IExamSchedule> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t('exam_schedule'),
    route: '/exam-schedules',
    getDisplayName: getExamScheduleDisplayName,
    getInitials: getExamScheduleInitials,
    item: examSchedule,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'exam', label: t(LOCALE_KEYS.EXAM), render: (exam: any) => exam?.name || 'N/A' },
      { key: 'room', label: t(LOCALE_KEYS.ROOM), render: (room: any) => room?.name || 'N/A' },
      {
        key: 'faculty',
        label: t(LOCALE_KEYS.FACULTY),
        render: (faculty: any) => faculty?.fullName || 'N/A',
      },
      {
        key: 'weekDay',
        label: t(LOCALE_KEYS.WEEK_DAY),
        render: (weekDay: any) => weekDay?.name || 'N/A',
      },
      {
        key: 'timeSlot',
        label: t(LOCALE_KEYS.TIME_SLOT),
        render: (timeSlot: any) => timeSlot?.name || 'N/A',
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
