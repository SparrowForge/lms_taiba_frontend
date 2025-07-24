'use client';

import React, {useEffect, useState} from 'react';
import {useUsers} from '@/hooks/useUsers';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {IUser} from '@/types/user';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateUserDetailsConfig} from '@/components/users/userConfig';
import {Status} from '@/types/common';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const UserDetailPage: React.FC<UserDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { users, listStatus, loadUsers, getUserById, loadUser } = useUsers();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const userId = parseInt(resolvedParams.id);

    // First try to get user from the list
    const foundUser = getUserById(userId);
    if (foundUser) {
      setUser(foundUser);
    } else {
      // If not in list, load it individually
      loadUser(userId);
    }
  }, [resolvedParams.id, getUserById, loadUser]);

  useEffect(() => {
    if (users.length === 0) {
      loadUsers();
    }
  }, [users.length, loadUsers]);

  // Update user when it's loaded individually
  useEffect(() => {
    if (users.length > 0) {
      const foundUser = getUserById(parseInt(resolvedParams.id));
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, [users, resolvedParams.id, getUserById]);

  const config = useCreateUserDetailsConfig(
    user,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || null : null
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IUser>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserDetailPage;
