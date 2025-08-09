'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateInstituteDetailsConfig} from '@/components/institutes/instituteConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useInstitutes} from '@/hooks/useInstitutes';

import {Status} from '@/types/common';
import {IInstitute} from '@/types/institute';

interface PageProps {
  params: Promise<{ id: string }>;
}

const InstituteDetailPage: React.FC<PageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { institutes, listStatus, loadInstitutes, getInstituteById, loadInstitute } =
    useInstitutes();
  const [item, setItem] = useState<IInstitute | null>(null);
  const t = useTranslations();
  const entityName = t('institute');

  useEffect(() => {
    const itemId = parseInt(resolvedParams.id);
    const found = getInstituteById(itemId);
    if (found) setItem(found);
    else loadInstitute(itemId);
  }, [resolvedParams.id, getInstituteById, loadInstitute]);

  useEffect(() => {
    if (institutes.length === 0) loadInstitutes();
  }, [institutes.length, loadInstitutes]);

  useEffect(() => {
    if (institutes.length > 0) {
      const found = getInstituteById(parseInt(resolvedParams.id));
      if (found) setItem(found);
    }
  }, [institutes, resolvedParams.id, getInstituteById]);

  const config = useCreateInstituteDetailsConfig(
    item,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IInstitute>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default InstituteDetailPage;
