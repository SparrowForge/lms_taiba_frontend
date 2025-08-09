'use client';

import React from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import UserRoleForm from '@/components/userRoles/UserRoleForm';

const UserRoleCreatePage: React.FC = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <UserRoleForm mode="create" />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserRoleCreatePage;
