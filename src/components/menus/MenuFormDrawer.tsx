'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useLocalization } from '@/hooks/useLocalization';
import { useMenus } from '@/hooks/useMenus';

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
  const { getMenuById, selectedMenu, loadMenu, detailsStatus } = useMenus();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.MENU, { defaultValue: 'Menu' });
  useEffect(() => {
    if (visible && mode === 'edit' && menuId) {
      //getMenuById(menuId);
      loadMenu(menuId);
    }
  }, [visible, mode, menuId, loadMenu]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
  }

  return (
    <Drawer
      key={menuId} // Force remount when menuId changes
      title={
        mode === 'create'
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
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
