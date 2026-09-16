'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCreate__PascalSingular__DetailsConfig } from '@/components/__camelPlural__/__camelSingular__Config';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';
import { use__PascalPlural__ } from '@/hooks/use__PascalPlural__';

import { I__PascalSingular__ } from '@/types/__camelSingular__';

export default function __PascalSingular__DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { selected__PascalSingular__, detailsStatus, load__PascalSingular__ } =
    use__PascalPlural__();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.__CONST_SINGULAR__, { defaultValue: '__TitleSingular__' });

  const resolvedParams = React.use(params);
  const __camelSingular__Id = parseInt(resolvedParams.id);

  // Load __lowerSingular__ if not already loaded
  useEffect(() => {
    load__PascalSingular__(__camelSingular__Id);
  }, [load__PascalSingular__, __camelSingular__Id]);

  const config = useCreate__PascalSingular__DetailsConfig(
    selected__PascalSingular__,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<I__PascalSingular__>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
