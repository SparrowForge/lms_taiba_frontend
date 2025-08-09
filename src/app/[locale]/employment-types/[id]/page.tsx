'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateEmploymentTypeDetailsConfig} from '@/components/employmentTypes/employmentTypeConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useEmploymentTypes} from '@/hooks/useEmploymentTypes';

import {Status} from '@/types/common';
import {IEmploymentType} from '@/types/employmentType';

interface PageProps {
  params: Promise<{ id: string }>;
}

const EmploymentTypeDetailPage: React.FC<PageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const {
    employmentTypes,
    listStatus,
    loadEmploymentTypes,
    getEmploymentTypeById,
    loadEmploymentType,
  } = useEmploymentTypes();
  const [item, setItem] = useState<IEmploymentType | null>(null);
  const t = useTranslations();
  const entityName = t('employmentType');

  useEffect(() => {
    const itemId = parseInt(resolvedParams.id);
    const found = getEmploymentTypeById(itemId);
    if (found) setItem(found);
    else loadEmploymentType(itemId);
  }, [resolvedParams.id, getEmploymentTypeById, loadEmploymentType]);

  useEffect(() => {
    if (employmentTypes.length === 0) loadEmploymentTypes();
  }, [employmentTypes.length, loadEmploymentTypes]);

  useEffect(() => {
    if (employmentTypes.length > 0) {
      const found = getEmploymentTypeById(parseInt(resolvedParams.id));
      if (found) setItem(found);
    }
  }, [employmentTypes, resolvedParams.id, getEmploymentTypeById]);

  const config = useCreateEmploymentTypeDetailsConfig(
    item,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IEmploymentType>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default EmploymentTypeDetailPage;
