'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useMenus} from '@/hooks/useMenus';

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
  const { selectedMenu, loadMenu, detailsStatus } = useMenus();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.MENU, { defaultValue: 'Menu' });
  useEffect(() => {
    if (visible && menuId) {
      //getMenuById(menuId);
      loadMenu(menuId);
    }
  }, [visible, menuId, loadMenu]);

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
      title={t(LOCALE_KEYS.DETAILS_NAME, { name: entityName })}
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
