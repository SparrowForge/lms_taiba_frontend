import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

import { IRole } from '@/types/role';

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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE, { defaultValue: 'Role' });
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
      { key: 'id', label: t(LOCALE_KEYS.ID) },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'description', label: t(LOCALE_KEYS.DESCRIPTION) },
      {
        key: 'branch.name',
        label: t(LOCALE_KEYS.BRANCH),
        render: (value: string, item: IRole) => item?.branch?.name || 'N/A',
      },
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
