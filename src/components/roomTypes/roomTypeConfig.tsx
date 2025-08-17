import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';

import {IRoomType} from '@/types/roomType';

export const getRoomTypeDisplayName = (item: IRoomType) =>
  item.name || `Room Type #${item.id}`;
export const getRoomTypeInitials = (item: IRoomType) =>
  item.name?.slice(0, 2).toUpperCase() || 'RT';

export const useCreateRoomTypeDetailsConfig = (
  item: IRoomType | null,
  loading: boolean,
  error: string | null,
  options: { embedded?: boolean; onEdit?: (rt: IRoomType) => void; onBack?: () => void } = {},
): EntityDetailsConfig<IRoomType> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.ROOM_TYPE, { defaultValue: 'Room Type' }),
    route: '/room-types',
    getDisplayName: getRoomTypeDisplayName,
    getInitials: getRoomTypeInitials,
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
