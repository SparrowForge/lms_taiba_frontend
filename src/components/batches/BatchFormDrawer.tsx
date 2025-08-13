'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useBatches} from '@/hooks/useBatches';

import BatchForm from './BatchForm';


interface BatchFormDrawerProps {
  mode: 'create' | 'edit';
  batchId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const BatchFormDrawer: React.FC<BatchFormDrawerProps> = ({
  mode,
  batchId,
  visible,
  onCancel,
  onSuccess,
}) => {
 
  const { getBatchById, selectedBatch } = useBatches();
  const t = useTranslations();
  const entityName = t('batch', { defaultValue: 'Batch' });
  useEffect(() => {
    if (visible && mode === 'edit' && batchId) {
      getBatchById(batchId);
    }
  }, [visible, mode, batchId, getBatchById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={batchId} // Force remount when batchId changes
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
      <BatchForm
        mode={mode}
        batchId={batchId}
        initialValues={selectedBatch || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default BatchFormDrawer;
