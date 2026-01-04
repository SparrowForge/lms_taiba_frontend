'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCreateSectionDetailsConfig } from '@/components/sections/sectionConfig';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useSections } from '@/hooks/useSections';
import { useLocalization } from '@/hooks/useLocalization';

import { ISection } from '@/types/section';

export default function SectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedSection, detailsStatus, loadSection } = useSections();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SECTION, { defaultValue: 'Section' });

  const resolvedParams = React.use(params);
  const sectionId = parseInt(resolvedParams.id);

  // Load section if not already loaded
  useEffect(() => {
    loadSection(sectionId);
  }, [loadSection, sectionId]);

  const config = useCreateSectionDetailsConfig(
    selectedSection,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<ISection>} />
      </MainLayout>
    </ProtectedRoute>
  );
}

