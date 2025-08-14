import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';

import {IScheduleType} from '@/types/scheduleType';

export const getScheduleTypeDisplayName = (item: IScheduleType) =>
  item.name || `Schedule Type #${item.id}`;
export const getScheduleTypeInitials = (item: IScheduleType) =>
  item.name?.slice(0, 2).toUpperCase() || 'ST';

export const useCreateScheduleTypeDetailsConfig = (
  item: IScheduleType | null,
  loading: boolean,
  error: string | null,
  options: { embedded?: boolean; onEdit?: (st: IScheduleType) => void; onBack?: () => void } = {},
): EntityDetailsConfig<IScheduleType> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.SCHEDULE_TYPE, { defaultValue: 'Schedule Type' }),
    route: '/schedule-types',
    getDisplayName: getScheduleTypeDisplayName,
    getInitials: getScheduleTypeInitials,
    item,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
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
