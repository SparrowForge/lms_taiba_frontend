import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';
import UserStatusTag from '@/components/users/UserStatusTag';

import { useLocalization } from '@/hooks/useLocalization';

import { IUser } from '@/types/user';

export const getUserDisplayName = (user: IUser) => {
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown User';
};

export const getUserInitials = (user: IUser) => {
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
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
        key: 'firstName',
        label: t(LOCALE_KEYS.FIRST_NAME),
      },
      {
        key: 'lastName',
        label: t(LOCALE_KEYS.LAST_NAME),
      },
      {
        key: 'email',
        label: t(LOCALE_KEYS.EMAIL),
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
