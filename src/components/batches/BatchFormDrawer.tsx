'use client';

import React, { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import { IBatch } from '@/types/batch';
import BatchForm from './BatchForm';
import { useBatches } from '@/hooks/useBatches';
import { useTranslations } from 'next-intl';

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
  const [initialValues, setInitialValues] = useState<Partial<IBatch> | undefined>();
  const { batches, getBatchById, loadBatch } = useBatches();
  const t = useTranslations();
  const entityName = t('batch', { defaultValue: 'Batch' });
  useEffect(() => {
    if (visible && mode === 'edit' && batchId) {
      // Try to get from current list first
      const existingBatch = getBatchById(batchId);
      if (existingBatch) {
        setInitialValues(existingBatch);
      } else {
        // Load from API if not in current list
        loadBatch(batchId);
      }
    } else {
      setInitialValues(undefined);
    }
  }, [visible, mode, batchId, getBatchById, loadBatch]);

  // Update initial values when batches list changes
  useEffect(() => {
    if (mode === 'edit' && batchId && batches.length > 0) {
      const batch = getBatchById(batchId);
      if (batch) {
        setInitialValues(batch);
      }
    }
  }, [batches, batchId, mode, getBatchById]);

  const handleSuccess = () => {
    onSuccess();
    setInitialValues(undefined);
  };

  const handleCancel = () => {
    onCancel();
    setInitialValues(undefined);
  };

  return (
    <Drawer
      title={mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName })}
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <BatchForm
        mode={mode}
        batchId={batchId}
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default BatchFormDrawer; 