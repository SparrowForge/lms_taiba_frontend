'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useDiscountTemplates } from '@/hooks/useDiscountTemplates';
import { useLocalization } from '@/hooks/useLocalization';

import { useCreateDiscountTemplateDetailsConfig } from '@/components/discountTemplates/discountTemplateConfig';

const DiscountTemplateDetailsPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params,
}) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedDiscountTemplate, detailsStatus, loadDiscountTemplate } = useDiscountTemplates();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.DISCOUNT_TEMPLATE, { defaultValue: 'Discount Template' });

  useEffect(() => {
    const id = parseInt(resolvedParams.id);
    loadDiscountTemplate(id);
  }, [resolvedParams.id, loadDiscountTemplate]);

  const config = useCreateDiscountTemplateDetailsConfig(
    selectedDiscountTemplate,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: false,
      onEdit: (item) => router.push(`/discount-templates/${item.id}/edit`),
      onBack: () => router.back(),
    },
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetailsContent config={config} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DiscountTemplateDetailsPage;

