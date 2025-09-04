'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import InstituteForm from '@/components/institutes/InstituteForm';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useInstitutes} from '@/hooks/useInstitutes';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';

const InstituteEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedInstitute, detailsStatus, getInstituteById, loadInstitute } = useInstitutes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.INSTITUTE, { defaultValue: 'Institute' });

  useEffect(() => {
    const instituteId = parseInt(resolvedParams.id);
    // getInstituteById(instituteId);
    loadInstitute(instituteId);
  }, [resolvedParams.id, loadInstitute]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedInstitute || selectedInstitute.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/institutes" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <InstituteForm
          mode="edit"
          instituteId={parseInt(resolvedParams.id)}
          initialValues={selectedInstitute}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default InstituteEditPage;
