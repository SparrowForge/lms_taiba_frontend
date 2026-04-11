'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DiscountTemplateForm from '@/components/discountTemplates/DiscountTemplateForm';
import { MainLayout } from '@/components/layout/MainLayout';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useDiscountTemplates } from '@/hooks/useDiscountTemplates';
import { useLocalization } from '@/hooks/useLocalization';

const DiscountTemplateEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedDiscountTemplate, detailsStatus, loadDiscountTemplate } = useDiscountTemplates();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.DISCOUNT_TEMPLATE, { defaultValue: 'Discount Template' });

  useEffect(() => {
    const id = parseInt(resolvedParams.id);
    loadDiscountTemplate(id);
  }, [resolvedParams.id, loadDiscountTemplate]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedDiscountTemplate || selectedDiscountTemplate.id !== parseInt(resolvedParams.id)) {
    return (
      <EntityEditNotFoundView
        entityName={entityName}
        backRoute="/discount-templates"
      />
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <DiscountTemplateForm
          mode="edit"
          discountTemplateId={parseInt(resolvedParams.id)}
          initialValues={selectedDiscountTemplate}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DiscountTemplateEditPage;

