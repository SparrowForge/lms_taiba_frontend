import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {useMenus} from '@/hooks/useMenus';
import {IMenu} from '@/types/menu';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';
import {createMenuDetailsConfig} from './menuConfig';
import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

interface MenuDetailsDrawerProps {
  menuId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit?: (menuId: number) => void;
}

const MenuDetailsDrawer: React.FC<MenuDetailsDrawerProps> = ({
  menuId,
  visible,
  onClose,
  onEdit
}) => {
  const { menus, listStatus, loadMenus, getMenuById, loadMenu } = useMenus();
  const [menu, setMenu] = useState<IMenu | null>(null);
  const t = useTranslations();
  const entityName = t('menu', { defaultValue: 'Menu' });

  useEffect(() => {
    if (menuId && visible) {
      const foundMenu = getMenuById(menuId);
      if (foundMenu) {
        setMenu(foundMenu);
      } else {
        loadMenu(menuId);
      }
    }
  }, [menuId, visible, getMenuById, loadMenu]);

  useEffect(() => {
    if (menus.length === 0) {
      loadMenus();
    }
  }, [menus.length, loadMenus]);

  useEffect(() => {
    if (menus.length > 0 && menuId) {
      const foundMenu = getMenuById(menuId);
      if (foundMenu) {
        setMenu(foundMenu);
      }
    }
  }, [menus, menuId, getMenuById]);

  const config = createMenuDetailsConfig(
    menu,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || null : null,
    { embedded: true, onEdit: onEdit ? (p) => onEdit(p.id) : undefined }
  );

  return (
    <Drawer
      title={t('details_name', { name: entityName })}
      open={visible}
      onClose={onClose}
      width={500}
      placement="right"
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default MenuDetailsDrawer;
