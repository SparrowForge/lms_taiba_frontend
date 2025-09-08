import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IWeekDay } from '@/types/weekDay';

export const getWeekDayDisplayName = (item: IWeekDay) => item.name || `Week Day #${item.id}`;
export const getWeekDayInitials = (item: IWeekDay) => item.name?.slice(0, 2).toUpperCase() || 'WD';

export const useCreateWeekDayDetailsConfig = (
  item: IWeekDay | null,
  loading: boolean,
  error: string | null,
  options: { embedded?: boolean; onEdit?: (wd: IWeekDay) => void; onBack?: () => void } = {},
): EntityDetailsConfig<IWeekDay> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.WEEK_DAY, { defaultValue: 'Week Day' }),
    route: '/week-days',
    getDisplayName: getWeekDayDisplayName,
    getInitials: getWeekDayInitials,
    item,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'dayNumber', label: t(LOCALE_KEYS.DAY_NUMBER) },
      {
        key: 'isWorkingDay',
        label: t(LOCALE_KEYS.IS_WORKING_DAY),
        render: (v: boolean) => (v ? t(LOCALE_KEYS.YES) : t(LOCALE_KEYS.NO)),
      },
      { key: 'remarks', label: t(LOCALE_KEYS.REMARKS) },
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
