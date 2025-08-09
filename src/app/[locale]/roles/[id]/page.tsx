'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateRoleDetailsConfig} from '@/components/roles/roleConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useRoles} from '@/hooks/useRoles';

import {Status} from '@/types/common';
import {IRole} from '@/types/role';

interface RoleDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const RoleDetailPage: React.FC<RoleDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { roles, listStatus, loadRoles, getRoleById, loadRole } = useRoles();
  const [role, setRole] = useState<IRole | null>(null);
  const t = useTranslations();
  const entityName = t('role', { defaultValue: 'Role' });

  useEffect(() => {
    const roleId = parseInt(resolvedParams.id);
    const foundRole = getRoleById(roleId);
    if (foundRole) {
      setRole(foundRole);
    } else {
      loadRole(roleId);
    }
  }, [resolvedParams.id, getRoleById, loadRole]);

  useEffect(() => {
    if (roles.length === 0) {
      loadRoles();
    }
  }, [roles.length, loadRoles]);

  useEffect(() => {
    if (roles.length > 0) {
      const foundRole = getRoleById(parseInt(resolvedParams.id));
      if (foundRole) {
        setRole(foundRole);
      }
    }
  }, [roles, resolvedParams.id, getRoleById]);

  const config = useCreateRoleDetailsConfig(
    role,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IRole>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default RoleDetailPage;
