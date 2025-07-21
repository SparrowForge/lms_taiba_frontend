import {IRoleMenuPermission} from '@/types/roleMenuPermission';
import {useTranslations} from 'next-intl';

export const getRoleMenuPermissionDisplayName = (permission: IRoleMenuPermission) =>
  `${permission.role.name} - ${permission.menu.name}`;

export const createRoleMenuPermissionDetailsConfig = (
  permission: IRoleMenuPermission | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (permission: IRoleMenuPermission) => void;
  } = {}
) => {
  const { embedded = false, onEdit } = options;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations();
  const entityName = t('roleMenuPermission', { defaultValue: 'Role Menu Permission' });
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
      { key: 'role.name', label: t('role'), render: (value: string, item: IRoleMenuPermission) => item?.role?.name || 'N/A' },
      { key: 'menu.name', label: t('menu'), render: (value: string, item: IRoleMenuPermission) => item?.menu?.name || 'N/A' },
      { key: 'view', label: t('view'), render: (value: boolean) => value ? t('yes') : t('no') },
      { key: 'insert', label: t('insert'), render: (value: boolean) => value ? t('yes') : t('no') },
      { key: 'update', label: t('update'), render: (value: boolean) => value ? t('yes') : t('no') },
      { key: 'delete', label: t('delete'), render: (value: boolean) => value ? t('yes') : t('no') },
      { key: 'createdAt', label: t('createdAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
      { key: 'updatedAt', label: t('updatedAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
    ],
  } as any; // Type assertion to fix generic type issue
};
