import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {useMenus} from '@/hooks/useMenus';
import {IMenu} from '@/types/menu';
import MenuForm from './MenuForm';
import {useTranslations} from 'next-intl';

interface MenuFormDrawerProps {
  mode: 'create' | 'edit';
  menuId?: number;
  initialValues?: Partial<IMenu>;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const MenuFormDrawer: React.FC<MenuFormDrawerProps> = ({
  mode,
  menuId,
  initialValues,
  visible,
  onCancel,
  onSuccess
}) => {
  const { getMenuById, loadMenu } = useMenus();
  const [menu, setMenu] = useState<IMenu | null>(null);
  const t = useTranslations();
  const entityName = t('menu', { defaultValue: 'Menu' });

  useEffect(() => {
    if (mode === 'edit' && menuId && visible) {
      const foundMenu = getMenuById(menuId);
      if (foundMenu) {
        setMenu(foundMenu);
      } else {
        loadMenu(menuId);
      }
    }
  }, [mode, menuId, visible, getMenuById, loadMenu]);

  const getTitle = () => (mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName }));

  const handleDrawerSuccess = () => {
    if (onSuccess) onSuccess();
    onCancel();
  };

  const getFormInitialValues = () => {
    if (mode === 'edit' && menu) {
      return {
        panelId: menu.panelId,
        parentId: menu.parentId,
        name: menu.name,
        route: menu.route,
        sortOrder: menu.sortOrder,
      };
    }
    return initialValues;
  };

  return (
    <Drawer
      title={getTitle()}
      open={visible}
      onClose={onCancel}
      width={500}
      placement="right"
    >
      <MenuForm
        mode={mode}
        menuId={menuId}
        initialValues={getFormInitialValues()}
        onSuccess={handleDrawerSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default MenuFormDrawer;
