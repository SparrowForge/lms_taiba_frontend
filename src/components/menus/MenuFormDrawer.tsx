import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useMenus} from '@/hooks/useMenus';

import {IMenu} from '@/types/menu';

import MenuForm from './MenuForm';


interface MenuFormDrawerProps {
  mode: 'create' | 'edit';
  menuId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const MenuFormDrawer: React.FC<MenuFormDrawerProps> = ({
  mode,
  menuId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [initialValues, setInitialValues] = useState<Partial<IMenu> | undefined>();
  const { getMenuById, loadMenu } = useMenus();
  const t = useTranslations();
  const entityName = t('menu', { defaultValue: 'Menu' });

  useEffect(() => {
    if (mode === 'edit' && menuId && visible) {
      const foundMenu = getMenuById(menuId);
      if (foundMenu) {
        setInitialValues(foundMenu);
      } else {
        loadMenu(menuId);
      }
    }
  }, [mode, menuId, visible, getMenuById, loadMenu]);

  const getTitle = () =>
    mode === 'create'
      ? t('create_name', { name: entityName })
      : t('edit_name', { name: entityName });

  const handleDrawerSuccess = () => {
    if (onSuccess) onSuccess();
    onCancel();
  };

  return (
    <Drawer title={getTitle()} open={visible} onClose={onCancel} width={500} placement="right">
      <MenuForm
        mode={mode}
        menuId={menuId}
        initialValues={initialValues}
        onSuccess={handleDrawerSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default MenuFormDrawer;
