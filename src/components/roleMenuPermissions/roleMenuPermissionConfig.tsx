import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

import {IRoleMenuPermission} from '@/types/roleMenuPermission';

export const getRoleMenuPermissionDisplayName = (permission: IRoleMenuPermission) =>
  `${permission.role.name} - ${permission.menu.name}`;

export const useCreateRoleMenuPermissionDetailsConfig = (
  permission: IRoleMenuPermission | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (permission: IRoleMenuPermission) => void;
  } = {},
) => {
  const { embedded = false, onEdit } = options;
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROLE_MENU_PERMISSION, { defaultValue: 'Role Menu Permission' });
  return {
    name: entityName,
    route: '/role-menu-permissions',
    getDisplayName: getRoleMenuPermissionDisplayName,
    getInitials: (permission: IRoleMenuPermission) => permission.role.name.charAt(0).toUpperCase(),
    item: permission,
    loading,
    error,
    embedded,
    onEdit,
    fields: [
      {
        key: 'role.name',
        label: t(LOCALE_KEYS.ROLE),
        render: (value: string, item: IRoleMenuPermission) => item?.role?.name || 'N/A',
      },
      {
        key: 'menu.name',
        label: t(LOCALE_KEYS.MENU),
        render: (value: string, item: IRoleMenuPermission) => item?.menu?.name || 'N/A',
      },
      { key: 'view', label: t(LOCALE_KEYS.VIEW), render: (value: boolean) => (value ? t(LOCALE_KEYS.YES) : t(LOCALE_KEYS.NO)) },
      {
        key: 'insert',
        label: t(LOCALE_KEYS.INSERT),
        render: (value: boolean) => (value ? t(LOCALE_KEYS.YES) : t(LOCALE_KEYS.NO)),
      },
      {
        key: 'update',
        label: t(LOCALE_KEYS.UPDATE),
        render: (value: boolean) => (value ? t(LOCALE_KEYS.YES) : t(LOCALE_KEYS.NO)),
      },
      {
        key: 'delete',
        label: t(LOCALE_KEYS.DELETE),
        render: (value: boolean) => (value ? t(LOCALE_KEYS.YES) : t(LOCALE_KEYS.NO)),
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
