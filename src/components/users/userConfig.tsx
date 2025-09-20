import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';
import UserStatusTag from '@/components/users/UserStatusTag';

import {useLocalization} from '@/hooks/useLocalization';

import {IUser} from '@/types/user';

export const getUserDisplayName = (user: IUser) => {
  return user.name || user.email || 'Unknown User';
};

export const getUserInitials = (user: IUser) => {
  const name = user.name || '';
  const nameParts = name.split(' ');
  if (nameParts.length >= 2) {
    return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase() || 'U';
};

export const useCreateUserDetailsConfig = (
  user: IUser | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (user: IUser) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IUser> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.USER),
    route: '/users',
    getDisplayName: getUserDisplayName,
    getInitials: getUserInitials,
    item: user,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'name',
        label: t(LOCALE_KEYS.NAME),
      },
      {
        key: 'email',
        label: t(LOCALE_KEYS.EMAIL),
      },
      {
        key: 'type',
        label: t(LOCALE_KEYS.TYPE),
      },
      {
        key: 'roles',
        label: t(LOCALE_KEYS.ROLES),
        render: (roles: any[]) =>
          roles?.length > 0 ? roles.map((role) => role.role?.name).join(', ') : 'No roles',
      },
      {
        key: 'phone',
        label: t(LOCALE_KEYS.PHONE),
      },
      {
        key: 'status',
        label: t(LOCALE_KEYS.STATUS),
        render: (value: string) => <UserStatusTag status={value} />,
      },
      {
        key: 'createdAt',
        label: t(LOCALE_KEYS.CREATED_AT),
        render: (value: string) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t(LOCALE_KEYS.UPDATED_AT),
        render: (value: string) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
      },
    ],
  };
};
