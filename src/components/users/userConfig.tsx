import React from 'react';
import {IUser} from '@/types/user';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';
import UserStatusTag from '@/components/users/UserStatusTag';

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

  return {
    name: 'User',
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
        label: 'First Name',
      },
      {
        key: 'lastName',
        label: 'Last Name',
      },
      {
        key: 'email',
        label: 'Email',
      },
      {
        key: 'phone',
        label: 'Phone',
      },
      {
        key: 'status',
        label: 'Status',
        render: (value: string) => <UserStatusTag status={value} />,
      },
      {
        key: 'createdAt',
        label: 'Created At',
        render: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A',
      },
      {
        key: 'updatedAt',
        label: 'Updated At',
        render: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A',
      },
    ],
  };
};
