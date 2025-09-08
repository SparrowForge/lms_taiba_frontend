import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { ITimeSlot } from '@/types/timeSlot';

export const getTimeSlotDisplayName = (item: ITimeSlot) => item.name || `Time Slot #${item.id}`;
export const getTimeSlotInitials = (item: ITimeSlot) =>
  item.name?.slice(0, 2).toUpperCase() || 'TS';

export const useCreateTimeSlotDetailsConfig = (
  item: ITimeSlot | null,
  loading: boolean,
  error: string | null,
  options: { embedded?: boolean; onEdit?: (ts: ITimeSlot) => void; onBack?: () => void } = {},
): EntityDetailsConfig<ITimeSlot> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.TIME_SLOT, { defaultValue: 'Time Slot' }),
    route: '/time-slots',
    getDisplayName: getTimeSlotDisplayName,
    getInitials: getTimeSlotInitials,
    item,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      {
        key: 'startTime',
        label: t(LOCALE_KEYS.START_TIME),
        render: (v: string) => (v ? v.substring(0, 5) : 'N/A'), // Show only HH:mm
      },
      {
        key: 'endTime',
        label: t(LOCALE_KEYS.END_TIME),
        render: (v: string) => (v ? v.substring(0, 5) : 'N/A'), // Show only HH:mm
      },
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
