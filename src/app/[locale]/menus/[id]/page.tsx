'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateMenuDetailsConfig} from '@/components/menus/menuConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useMenus} from '@/hooks/useMenus';

import {Status} from '@/types/common';
import {IMenu} from '@/types/menu';

export default function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedMenu, detailsStatus, loadMenu } = useMenus();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.MENU, { defaultValue: 'Menu' });

  const resolvedParams = React.use(params);
  const menuId = parseInt(resolvedParams.id);

  // Load menu if not already loaded
  useEffect(() => {
    //getMenuById(menuId);
    loadMenu(menuId);
  }, [loadMenu, menuId]);

  const config = useCreateMenuDetailsConfig(
    selectedMenu,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
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
