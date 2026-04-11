import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IEventType } from '@/types/eventType';

export const getEventTypeDisplayName = (item: IEventType) =>
  item.name || `Event Type #${item.id}`;

export const getEventTypeInitials = (item: IEventType) =>
  item.name?.slice(0, 2).toUpperCase() || 'EV';

export const useCreateEventTypeDetailsConfig = (
  item: IEventType | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (ct: IEventType) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IEventType> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.EVENT_TYPE),
    route: '/event-types',
    getDisplayName: getEventTypeDisplayName,
    getInitials: getEventTypeInitials,
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
        key: 'color',
        label: 'Color',
        render: (value: string) =>
          value ? (
            <span>
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: value,
                  marginRight: 8,
                  border: '1px solid #ddd',
                }}
              />
              {value}
            </span>
          ) : (
            'N/A'
          ),
      },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
      { key: 'sortOrder', label: 'Sort Order' },
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

