import React from 'react';
import {IUser} from '@/types/user';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';
import UserStatusTag from '@/components/users/UserStatusTag';
import { useTranslations } from 'next-intl';

export const getUserDisplayName = (user: IUser) => {
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown User';
};

export const getUserInitials = (user: IUser) => {
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
};

export const createUserDetailsConfig = (
  user: IUser | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (user: IUser) => void;
    onBack?: () => void;
  } = {}
): EntityDetailsConfig<IUser> => {
  const { embedded = false, onEdit, onBack } = options;
  const t = useTranslations();
  return {
    name: t('user'),
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
        label: t('firstName'),
      },
      {
        key: 'lastName',
        label: t('lastName'),
      },
      {
        key: 'email',
        label: t('email'),
      },
      {
        key: 'phone',
        label: t('phone'),
      },
      {
        key: 'status',
        label: t('status'),
        render: (value: string) => <UserStatusTag status={value} />,
      },
      {
        key: 'createdAt',
        label: t('createdAt'),
        render: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A',
      },
      {
        key: 'updatedAt',
        label: t('updatedAt'),
        render: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A',
      },
    ],
  };
};
