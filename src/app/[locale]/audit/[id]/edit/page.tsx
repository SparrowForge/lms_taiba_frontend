'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useAudit} from '@/hooks/useAudit';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';

const AuditEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedAudit, detailsStatus, getAuditById } = useAudit();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.AUDIT, { defaultValue: 'Audit' });

  useEffect(() => {
    const auditId = parseInt(resolvedParams.id);
    getAuditById(auditId);
  }, [resolvedParams.id, getAuditById]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedAudit) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/audit" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AuditEditPage;
