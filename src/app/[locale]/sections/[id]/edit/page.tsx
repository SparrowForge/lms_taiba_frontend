'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import SectionForm from '@/components/sections/SectionForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useSections } from '@/hooks/useSections';
import { useLocalization } from '@/hooks/useLocalization';

const SectionEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedSection, detailsStatus, loadSection } = useSections();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SECTION, { defaultValue: 'Section' });

  useEffect(() => {
    const sectionId = parseInt(resolvedParams.id);
    loadSection(sectionId);
  }, [resolvedParams.id, loadSection]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedSection || selectedSection.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/sections" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <SectionForm
          mode="edit"
          sectionId={parseInt(resolvedParams.id)}
          initialValues={selectedSection}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SectionEditPage;

