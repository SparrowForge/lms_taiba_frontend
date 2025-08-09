import {useTranslations} from 'next-intl';

import {IRole} from '@/types/role';

export const getRoleDisplayName = (role: IRole) => role.name;

export const useCreateRoleDetailsConfig = (
  role: IRole | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (role: IRole) => void;
  } = {},
) => {
  const { embedded = false, onEdit } = options;
  const t = useTranslations();
  const entityName = t('role', { defaultValue: 'Role' });
  return {
    name: entityName,
    route: '/roles',
    getDisplayName: getRoleDisplayName,
    getInitials: (role: IRole) => role.name.charAt(0).toUpperCase(),
    item: role,
    loading,
    error,
    embedded,
    onEdit,
    fields: [
      { key: 'id', label: t('id') },
      { key: 'name', label: t('name') },
      { key: 'description', label: t('description') },
      {
        key: 'branch.name',
        label: t('branch'),
        render: (value: string, item: IRole) => item?.branch?.name || 'N/A',
      },
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
