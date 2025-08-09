import {useTranslations} from 'next-intl';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {IUserRole} from '@/types/userRole';

export const getUserRoleDisplayName = (userRole: IUserRole | null): string => {
  if (!userRole) return 'N/A';
  return `${userRole.user?.firstName} ${userRole.user?.lastName} - ${userRole.role?.name}`;
};

export const getUserRoleInitials = (userRole: IUserRole | null): string => {
  if (!userRole?.user) return 'UR';
  return `${userRole.user.firstName?.slice(0, 1)}${userRole.user.lastName?.slice(0, 1)}`.toUpperCase();
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
  const t = useTranslations();
  return {
    name: t('userRole'),
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
        label: t('user'),
        render: (value: string, item: IUserRole) =>
          item?.user ? `${item.user.firstName} ${item.user.lastName}` : 'N/A',
      },
      {
        key: 'user.email',
        label: t('email'),
        render: (value: string, item: IUserRole) => item?.user?.email || 'N/A',
      },
      {
        key: 'user.phone',
        label: t('phone'),
        render: (value: string, item: IUserRole) => item?.user?.phone || 'N/A',
      },
      {
        key: 'user.status',
        label: t('status'),
        render: (value: string, item: IUserRole) => item?.user?.status || 'N/A',
      },
      {
        key: 'role.name',
        label: t('role'),
        render: (value: string, item: IUserRole) => item?.role?.name || 'N/A',
      },
      {
        key: 'role.description',
        label: t('description'),
        render: (value: string, item: IUserRole) => item?.role?.description || 'N/A',
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
