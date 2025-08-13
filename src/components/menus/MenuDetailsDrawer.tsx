'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useMenus} from '@/hooks/useMenus';

import {Status} from '@/types/common';
import {IMenu} from '@/types/menu';

import {useCreateMenuDetailsConfig} from './menuConfig';


interface MenuDetailsDrawerProps {
  menuId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (menuId: number) => void;
}

const MenuDetailsDrawer: React.FC<MenuDetailsDrawerProps> = ({
  menuId,
  visible,
  onClose,
  onEdit,
}) => {
  
  const { selectedMenu, getMenuById, detailsStatus } = useMenus();
  const t = useTranslations();
  const entityName = t('menu', { defaultValue: 'Menu' });
  useEffect(() => {
    if (visible && menuId) {
      getMenuById(menuId);
    }
  }, [visible, menuId, getMenuById]);

  const handleEdit = (menu: IMenu) => {
    onEdit(menu.id);
  };

  const config = useCreateMenuDetailsConfig(
    selectedMenu,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={menuId} // Force remount when menuId changes
      title={t('details_name', { name: entityName })}
      width={800}
      open={visible}
      onClose={onClose}
      destroyOnHidden={true}
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default MenuDetailsDrawer;
