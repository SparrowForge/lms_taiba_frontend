'use client';

import { Drawer } from 'antd';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

import BatchForm from './BatchForm';

interface BatchFormDrawerProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const BatchFormDrawer: React.FC<BatchFormDrawerProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' });

  return (
    <Drawer
      title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })}
      width={600}
      open={visible}
      onClose={onCancel}
      destroyOnClose
    >
      <BatchForm
        onSuccess={onSuccess}
        onCancel={onCancel}
        embedded
      />
    </Drawer>
  );
};

export default BatchFormDrawer;
