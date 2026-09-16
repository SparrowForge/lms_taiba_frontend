'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCreateLeadDetailsConfig } from '@/components/leads/leadConfig';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLeads } from '@/hooks/useLeads';
import { useLocalization } from '@/hooks/useLocalization';

import { ILead } from '@/types/lead';

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedLead, detailsStatus, loadLead } = useLeads();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.LEAD, { defaultValue: 'Lead' });

  const resolvedParams = React.use(params);
  const leadId = parseInt(resolvedParams.id);

  // Load lead if not already loaded
  useEffect(() => {
    loadLead(leadId);
  }, [loadLead, leadId]);

  const config = useCreateLeadDetailsConfig(
    selectedLead,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<ILead>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
