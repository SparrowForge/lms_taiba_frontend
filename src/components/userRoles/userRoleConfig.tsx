import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';

import {IUserRole} from '@/types/userRole';

export const getUserRoleDisplayName = (userRole: IUserRole | null): string => {
  if (!userRole) return 'N/A';
  return `${userRole.user?.name || userRole.user?.email} - ${userRole.role?.name}`;
};

export const getUserRoleInitials = (userRole: IUserRole | null): string => {
  if (!userRole?.user) return 'UR';
  const name = userRole.user?.name || '';
  const nameParts = name.split(' ');
  if (nameParts.length >= 2) {
    return `${nameParts[0].slice(0, 1)}${nameParts[1].slice(0, 1)}`.toUpperCase();
  }
  return name.slice(0, 1).toUpperCase() || 'U';
};

export const useCreateUserRoleDetailsConfig = (
  userRole: IUserRole | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (userRole: IUserRole) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IUserRole> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.USER_ROLE),
    route: '/user-roles',
    getDisplayName: getUserRoleDisplayName,
    getInitials: getUserRoleInitials,
    item: userRole,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      {
        key: 'user.fullName',
        label: t(LOCALE_KEYS.USER),
        render: (value: string, item: IUserRole) =>
          item?.user ? item.user.name || item.user.email : 'N/A',
      },
      {
        key: 'user.email',
        label: t(LOCALE_KEYS.EMAIL),
        render: (value: string, item: IUserRole) => item?.user?.email || 'N/A',
      },
      {
        key: 'user.phone',
        label: t(LOCALE_KEYS.PHONE),
        render: (value: string, item: IUserRole) => item?.user?.phone || 'N/A',
      },
      {
        key: 'user.status',
        label: t(LOCALE_KEYS.STATUS),
        render: (value: string, item: IUserRole) => item?.user?.status || 'N/A',
      },
      {
        key: 'role.name',
        label: t(LOCALE_KEYS.ROLE),
        render: (value: string, item: IUserRole) => item?.role?.name || 'N/A',
      },
      {
        key: 'role.description',
        label: t(LOCALE_KEYS.DESCRIPTION),
        render: (value: string, item: IUserRole) => item?.role?.description || 'N/A',
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
