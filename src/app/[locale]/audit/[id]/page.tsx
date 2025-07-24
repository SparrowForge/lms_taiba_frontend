'use client';

import React, {useEffect, useState} from 'react';
import {useAudit} from '@/hooks/useAudit';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {IAudit} from '@/types/audit';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateAuditDetailsConfig} from '@/components/audits/auditConfig';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';

interface AuditDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const AuditDetailPage: React.FC<AuditDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { audits, listStatus, loadAudits, getAuditById, loadAudit } = useAudit();
  const [audit, setAudit] = useState<IAudit | null>(null);
  const t = useTranslations();
  const entityName = t('audit', { defaultValue: 'Audit' });

  useEffect(() => {
    const auditId = parseInt(resolvedParams.id);
    const foundAudit = getAuditById(auditId);
    if (foundAudit) {
      setAudit(foundAudit);
    } else {
      loadAudit(auditId);
    }
  }, [resolvedParams.id, getAuditById, loadAudit]);

  useEffect(() => {
    if (audits.length === 0) {
      loadAudits();
    }
  }, [audits.length, loadAudits]);

  useEffect(() => {
    if (audits.length > 0) {
      const foundAudit = getAuditById(parseInt(resolvedParams.id));
      if (foundAudit) {
        setAudit(foundAudit);
      }
    }
  }, [audits, resolvedParams.id, getAuditById]);

  const config = useCreateAuditDetailsConfig(
    audit,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || t('failed_name', { name: entityName }) : null
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AuditDetailPage;
