'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import MenuForm from '@/components/menus/MenuForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useMenus} from '@/hooks/useMenus';

import {Status} from '@/types/common';


const MenuEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedMenu, detailsStatus, getMenuById } = useMenus();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.MENU, { defaultValue: 'Menu' });

  useEffect(() => {
    const menuId = parseInt(resolvedParams.id);
    getMenuById(menuId);
  }, [resolvedParams.id, getMenuById]);


  if (detailsStatus.status === Status.LOADING) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Spin />
            <div>{t(LOCALE_KEYS.LOADING, { defaultValue: 'Loading...' })} {entityName}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedMenu || selectedMenu.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/menus')}>
                  {t(LOCALE_KEYS.BACK_TO_LIST_NAME, { name: entityName })}</Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
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
