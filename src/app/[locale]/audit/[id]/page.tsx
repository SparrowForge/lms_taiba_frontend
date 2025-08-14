'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useCreateAuditDetailsConfig} from '@/components/audits/auditConfig';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useAudit} from '@/hooks/useAudit';
import {useLocalization} from '@/hooks/useLocalization';

import {IAudit} from '@/types/audit';
import {Status} from '@/types/common';

export default function AuditDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { selectedAudit, detailsStatus, getAuditById } = useAudit();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.AUDIT, { defaultValue: 'Audit' });

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
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
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
