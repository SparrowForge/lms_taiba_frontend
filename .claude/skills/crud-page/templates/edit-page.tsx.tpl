'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import __PascalSingular__Form from '@/components/__camelPlural__/__PascalSingular__Form';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';
import { use__PascalPlural__ } from '@/hooks/use__PascalPlural__';

const __PascalSingular__EditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selected__PascalSingular__, detailsStatus, load__PascalSingular__ } =
    use__PascalPlural__();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.__CONST_SINGULAR__, { defaultValue: '__TitleSingular__' });

  useEffect(() => {
    const __camelSingular__Id = parseInt(resolvedParams.id);
    load__PascalSingular__(__camelSingular__Id);
  }, [resolvedParams.id, load__PascalSingular__]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (
    !selected__PascalSingular__ ||
    selected__PascalSingular__.id !== parseInt(resolvedParams.id)
  ) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/__kebabPlural__" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <__PascalSingular__Form
          mode="edit"
          __camelSingular__Id={parseInt(resolvedParams.id)}
          initialValues={selected__PascalSingular__}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default __PascalSingular__EditPage;
