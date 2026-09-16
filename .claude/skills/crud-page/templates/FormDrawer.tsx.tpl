'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useLocalization } from '@/hooks/useLocalization';
import { use__PascalPlural__ } from '@/hooks/use__PascalPlural__';

import __PascalSingular__Form from './__PascalSingular__Form';

interface Props {
  mode: 'create' | 'edit';
  __camelSingular__Id?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const __PascalSingular__FormDrawer: React.FC<Props> = ({
  mode,
  __camelSingular__Id,
  visible,
  onCancel,
  onSuccess,
}) => {
  const {
    get__PascalSingular__ById,
    selected__PascalSingular__,
    load__PascalSingular__,
    detailsStatus,
  } = use__PascalPlural__();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.__CONST_SINGULAR__, { defaultValue: '__TitleSingular__' });

  useEffect(() => {
    if (visible && mode === 'edit' && __camelSingular__Id) {
      load__PascalSingular__(__camelSingular__Id);
    }
  }, [visible, mode, __camelSingular__Id, load__PascalSingular__]);

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
      key={__camelSingular__Id} // Force remount when __camelSingular__Id changes
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
      <__PascalSingular__Form
        mode={mode}
        __camelSingular__Id={__camelSingular__Id}
        initialValues={selected__PascalSingular__ || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default __PascalSingular__FormDrawer;
