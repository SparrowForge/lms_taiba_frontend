'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import MenuForm from '@/components/menus/MenuForm';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useMenus} from '@/hooks/useMenus';

import {Status} from '@/types/common';


const MenuEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedMenu, detailsStatus, loadMenu } = useMenus();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.MENU, { defaultValue: 'Menu' });

  useEffect(() => {
    const menuId = parseInt(resolvedParams.id);
    //getMenuById(menuId);
    loadMenu(menuId);
  }, [resolvedParams.id, loadMenu]);


  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedMenu || selectedMenu.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/menus" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
          <MenuForm
            mode="edit"
            menuId={parseInt(resolvedParams.id)}
            initialValues={selectedMenu}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default MenuEditPage;
