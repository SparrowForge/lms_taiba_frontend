'use client';

import React, {useEffect, useState} from 'react';
import {Button, Card} from 'antd';
import {useRouter} from 'next/navigation';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useMenus} from '@/hooks/useMenus';
import {IMenu} from '@/types/menu';
import {useTranslations} from 'next-intl';
import MenuForm from '@/components/menus/MenuForm';
import {PageHeader} from '@/components/ui/PageHeader';

interface MenuEditPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const MenuEditPage: React.FC<MenuEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { menus, listStatus, loadMenus, getMenuById, loadMenu } = useMenus();
  const [menu, setMenu] = useState<IMenu | null>(null);
  const t = useTranslations();
  const entityName = t('menu', { defaultValue: 'Menu' });

  useEffect(() => {
    const menuId = parseInt(resolvedParams.id);
    const foundMenu = getMenuById(menuId);
    if (foundMenu) {
      setMenu(foundMenu);
    } else {
      loadMenu(menuId);
    }
  }, [resolvedParams.id, getMenuById, loadMenu]);

  useEffect(() => {
    if (menus.length === 0) {
      loadMenus();
    }
  }, [menus.length, loadMenus]);

  useEffect(() => {
    if (menus.length > 0) {
      const foundMenu = getMenuById(parseInt(resolvedParams.id));
      if (foundMenu) {
        setMenu(foundMenu);
      }
    }
  }, [menus, resolvedParams.id, getMenuById]);

  if (listStatus.status === 'loading') {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div>{t('loading', { defaultValue: 'Loading...' })}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!menu) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t('notFound_name', { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/menus')}>
                  {t('backToList_name', { name: entityName })}
                </Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const getInitialValues = () => ({
    panelId: menu.panelId,
    parentId: menu.parentId,
    name: menu.name,
    route: menu.route,
    sortOrder: menu.sortOrder,
  });

  return (
    <ProtectedRoute>
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <PageHeader title={t('edit_name', { name: entityName })} onBack={handleBack} />
          <MenuForm
            mode="edit"
            menuId={menu.id}
            initialValues={getInitialValues()}
            embedded={false}
            onCancel={handleBack}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default MenuEditPage;
