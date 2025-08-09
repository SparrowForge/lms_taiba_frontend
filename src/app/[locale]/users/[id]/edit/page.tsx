'use client';

import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';


import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {PageHeader} from '@/components/ui/PageHeader';
import UserForm from '@/components/users/UserForm';

import {useUsers} from '@/hooks/useUsers';

import {Status} from '@/types/common';
import {IUser} from '@/types/user';

interface UserEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const UserEditPage: React.FC<UserEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
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

  if (listStatus.status === Status.LOADING) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div>Loading user details...</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>User not found</h2>
                <Button type="primary" onClick={() => router.push('/users')}>
                  Back to Users
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div>
          <PageHeader title="Edit User" onBack={handleBack} />
          <UserForm
            mode="edit"
            userId={parseInt(resolvedParams.id)}
            initialValues={{
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              status: user.status as 'active' | 'inactive' | 'pending',
            }}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserEditPage;
