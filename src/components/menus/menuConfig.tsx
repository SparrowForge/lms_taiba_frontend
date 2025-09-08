import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

import { IMenu } from '@/types/menu';

export const getMenuDisplayName = (menu: IMenu) => menu.name;

export const useCreateMenuDetailsConfig = (
  menu: IMenu | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (menu: IMenu) => void;
  } = {},
) => {
  const { embedded = false, onEdit } = options;
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.MENU, { defaultValue: 'Menu' });
  return {
    name: entityName,
    route: '/menus',
    getDisplayName: getMenuDisplayName,
    getInitials: (menu: IMenu) => menu.name.charAt(0).toUpperCase(),
    item: menu,
    loading,
    error,
    embedded,
    onEdit,
    fields: [
      { key: 'id', label: t(LOCALE_KEYS.ID) },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'localName', label: t(LOCALE_KEYS.LOCAL_NAME) },
      { key: 'icon', label: t(LOCALE_KEYS.ICON) },
      { key: 'route', label: t(LOCALE_KEYS.ROUTE) },
      {
        key: 'panel.name',
        label: t(LOCALE_KEYS.PANEL),
        render: (value: string, item: IMenu) => item?.panel?.name || 'N/A',
      },
      {
        key: 'parent.name',
        label: t(LOCALE_KEYS.PARENT),
        render: (value: string, item: IMenu) => item?.parent?.name || 'N/A',
      },
      { key: 'sortOrder', label: t(LOCALE_KEYS.SORT_ORDER) },
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
