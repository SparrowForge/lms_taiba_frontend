'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';
import UserForm from '@/components/users/UserForm';

import {useLocalization} from '@/hooks/useLocalization';
import {useUsers} from '@/hooks/useUsers';


const UserEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedUser, detailsStatus, loadUser } = useUsers();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER, { defaultValue: 'User' });

  useEffect(() => {
    const userId = parseInt(resolvedParams.id);
    //getUserById(userId);
    loadUser(userId);
  }, [resolvedParams.id, loadUser]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedUser || selectedUser.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/users" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <UserForm mode="edit" userId={parseInt(resolvedParams.id)} initialValues={selectedUser} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserEditPage;
