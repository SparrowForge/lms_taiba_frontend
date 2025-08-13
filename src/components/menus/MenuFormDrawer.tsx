'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useMenus} from '@/hooks/useMenus';

import MenuForm from './MenuForm';


interface MenuFormDrawerProps {
  mode: 'create' | 'edit';
  menuId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const MenuFormDrawer: React.FC<MenuFormDrawerProps> = ({
  mode,
  menuId,
  visible,
  onCancel,
  onSuccess,
}) => {
 
  const { getMenuById, selectedMenu } = useMenus();
  const t = useTranslations();
  const entityName = t('menu', { defaultValue: 'Menu' });
  useEffect(() => {
    if (visible && mode === 'edit' && menuId) {
      getMenuById(menuId);
    }
  }, [visible, mode, menuId, getMenuById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={menuId} // Force remount when menuId changes
      title={
        mode === 'create'
          ? t('create_name', { name: entityName })
          : t('edit_name', { name: entityName })
      }
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <MenuForm
        mode={mode}
        menuId={menuId}
        initialValues={selectedMenu || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default MenuFormDrawer;
