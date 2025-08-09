import {useTranslations} from 'next-intl';

import {IMenu} from '@/types/menu';

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
  const t = useTranslations();
  const entityName = t('menu', { defaultValue: 'Menu' });
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
      { key: 'id', label: t('id') },
      { key: 'name', label: t('name') },
      { key: 'route', label: t('route') },
      {
        key: 'panel.name',
        label: t('panel'),
        render: (value: string, item: IMenu) => item?.panel?.name || 'N/A',
      },
      {
        key: 'parent.name',
        label: t('parent'),
        render: (value: string, item: IMenu) => item?.parent?.name || 'N/A',
      },
      { key: 'sortOrder', label: t('sortOrder') },
      {
        key: 'createdAt',
        label: t('createdAt'),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t('updatedAt'),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
    ],
  };
};
