'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useBatches} from '@/hooks/useBatches';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';

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
  const { getBatchById, selectedBatch, loadBatch, detailsStatus } = useBatches();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' });
  useEffect(() => {
    if (visible && mode === 'edit' && batchId) {
      //getBatchById(batchId);
      loadBatch(batchId);
    }
  }, [visible, mode, batchId, loadBatch]);

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
      key={batchId} // Force remount when batchId changes
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
