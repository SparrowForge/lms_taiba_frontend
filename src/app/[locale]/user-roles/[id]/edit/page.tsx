'use client';

import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import UserRoleForm from '@/components/userRoles/UserRoleForm';

import {useUserRoles} from '@/hooks/useUserRoles';

import {IUserRole} from '@/types/userRole';

interface UserRoleEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const UserRoleEditPage: React.FC<UserRoleEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { selectedUserRole, loadUserRole } = useUserRoles();
  const [initialValues, setInitialValues] = useState<Partial<IUserRole> | undefined>();

  useEffect(() => {
    const userRoleId = parseInt(resolvedParams.id);
    loadUserRole(userRoleId);
  }, [resolvedParams.id, loadUserRole]);

  useEffect(() => {
    if (selectedUserRole && selectedUserRole.id === parseInt(resolvedParams.id)) {
      setInitialValues({
        userId: selectedUserRole.userId,
        roleId: selectedUserRole.roleId,
      });
    }
  }, [selectedUserRole, resolvedParams.id]);

  return (
    <ProtectedRoute>
      <MainLayout>
        <UserRoleForm
          mode="edit"
          userRoleId={parseInt(resolvedParams.id)}
          initialValues={initialValues}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserRoleEditPage;
