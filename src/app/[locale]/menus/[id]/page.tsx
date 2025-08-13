'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateMenuDetailsConfig} from '@/components/menus/menuConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useMenus} from '@/hooks/useMenus';

import {Status} from '@/types/common';
import {IMenu} from '@/types/menu';

export default function MenuDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { selectedMenu, detailsStatus, getMenuById } = useMenus();
  const t = useTranslations();
  const entityName = t('menu');

  const resolvedParams = React.use(params);
  const menuId = parseInt(resolvedParams.id);

  // Load menu if not already loaded
  useEffect(() => {
    getMenuById(menuId);
  }, [getMenuById, menuId]);

  const config = useCreateMenuDetailsConfig(
    selectedMenu,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
          <EntityDetails config={config as EntityDetailsConfig<IMenu>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
