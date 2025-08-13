'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useBatches} from '@/hooks/useBatches';

import {IBatch} from '@/types/batch';
import {Status} from '@/types/common';

import {useCreateBatchDetailsConfig} from './batchConfig';


interface BatchDetailsDrawerProps {
  batchId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (batchId: number) => void;
}

const BatchDetailsDrawer: React.FC<BatchDetailsDrawerProps> = ({
  batchId,
  visible,
  onClose,
  onEdit,
}) => {
  
  const { selectedBatch, getBatchById, detailsStatus } = useBatches();
  const t = useTranslations();
  const entityName = t('batch', { defaultValue: 'Batch' });
  useEffect(() => {
    if (visible && batchId) {
      getBatchById(batchId);
    }
  }, [visible, batchId, getBatchById]);

  const handleEdit = (batch: IBatch) => {
    onEdit(batch.id);
  };

  const config = useCreateBatchDetailsConfig(
    selectedBatch,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={batchId} // Force remount when batchId changes
      title={t('details_name', { name: entityName })}
      width={800}
      open={visible}
      onClose={onClose}
      destroyOnHidden={true}
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default BatchDetailsDrawer;
