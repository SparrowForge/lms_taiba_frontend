'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useCreateAuditDetailsConfig} from '@/components/audits/auditConfig';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useAudit} from '@/hooks/useAudit';

import {IAudit} from '@/types/audit';
import {Status} from '@/types/common';

export default function AuditDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedAudit, detailsStatus, getAuditById } = useAudit();
  const t = useTranslations();
  const entityName = t('audit');

  const resolvedParams = React.use(params);
  const auditId = parseInt(resolvedParams.id);

  // Load audit if not already loaded
  useEffect(() => {
    getAuditById(auditId);
  }, [getAuditById, auditId]);

  const config = useCreateAuditDetailsConfig(
    selectedAudit,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IAudit>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
