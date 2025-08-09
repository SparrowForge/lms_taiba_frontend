import {useTranslations} from 'next-intl';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

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
  const t = useTranslations();
  return {
    name: t('scheduleType'),
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
      { key: 'name', label: t('name') },
      { key: 'status', label: t('status') },
      {
        key: 'createdAt',
        label: t('createdAt'),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t('updatedAt'),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
    ],
  };
};
