import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { I__PascalSingular__ } from '@/types/__camelSingular__';

export const get__PascalSingular__DisplayName = (item: I__PascalSingular__) =>
  item.name || `__TitleSingular__ #${item.id}`;
export const get__PascalSingular__Initials = (item: I__PascalSingular__) =>
  item.name?.slice(0, 2).toUpperCase() || '__INITIALS__';

export const useCreate__PascalSingular__DetailsConfig = (
  item: I__PascalSingular__ | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (rt: I__PascalSingular__) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<I__PascalSingular__> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.__CONST_SINGULAR__, { defaultValue: '__TitleSingular__' }),
    route: '/__kebabPlural__',
    getDisplayName: get__PascalSingular__DisplayName,
    getInitials: get__PascalSingular__Initials,
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
