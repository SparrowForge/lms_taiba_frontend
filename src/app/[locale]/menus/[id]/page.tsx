'use client';

import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateMenuDetailsConfig} from '@/components/menus/menuConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useMenus} from '@/hooks/useMenus';

import {Status} from '@/types/common';
import {IMenu} from '@/types/menu';

interface MenuDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const MenuDetailPage: React.FC<MenuDetailPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
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

  const config = useCreateMenuDetailsConfig(
    menu,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED
      ? listStatus.message || t('failed_name', { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IMenu>} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default MenuDetailPage;
