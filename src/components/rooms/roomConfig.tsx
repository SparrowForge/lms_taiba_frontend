import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IRoom } from '@/types/room';

export const getRoomDisplayName = (item: IRoom) => item.name || `Room #${item.id}`;

export const getRoomInitials = (item: IRoom) => item.name?.slice(0, 2).toUpperCase() || 'RM';

export const useCreateRoomDetailsConfig = (
  item: IRoom | null,
  loading: boolean,
  error: string | null,
  options: { embedded?: boolean; onEdit?: (rt: IRoom) => void; onBack?: () => void } = {},
): EntityDetailsConfig<IRoom> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();

  return {
    name: t(LOCALE_KEYS.ROOM, { defaultValue: 'Room' }),
    route: '/rooms',
    getDisplayName: getRoomDisplayName,
    getInitials: getRoomInitials,
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
        key: 'roomType',
        label: t(LOCALE_KEYS.ROOM_TYPE, { defaultValue: 'Room Type' }),
        render: (v: any) => v?.name || 'N/A',
      },
      {
        key: 'levelFloor',
        label: t(LOCALE_KEYS.LEVEL_FLOOR, { defaultValue: 'Level/Floor' }),
      },
      {
        key: 'sittingCapacity',
        label: t(LOCALE_KEYS.SITTING_CAPACITY, { defaultValue: 'Sitting Capacity' }),
      },
      {
        key: 'examCapacity',
        label: t(LOCALE_KEYS.EXAM_CAPACITY, { defaultValue: 'Exam Capacity' }),
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
