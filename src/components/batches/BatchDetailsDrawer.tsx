'use client';

import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {IBatch} from '@/types/batch';
import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';
import {useCreateBatchDetailsConfig} from './batchConfig';
import {useBatches} from '@/hooks/useBatches';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';

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
  const [batch, setBatch] = useState<IBatch | null>(null);
  const { batches, getBatchById, loadBatch, detailsStatus } = useBatches();
  const t = useTranslations();
  const entityName = t('batch', { defaultValue: 'Batch' });
  useEffect(() => {
    if (visible && batchId) {
      // Try to get from current list first
      const existingBatch = getBatchById(batchId);
      if (existingBatch) {
        setBatch(existingBatch);
      } else {
        // Load from API if not in current list
        loadBatch(batchId);
      }
    } else {
      setBatch(null);
    }
  }, [visible, batchId, getBatchById, loadBatch]);

  // Update batch when batches list changes
  useEffect(() => {
    if (batchId && batches.length > 0) {
      const foundBatch = getBatchById(batchId);
      if (foundBatch) {
        setBatch(foundBatch);
      }
    }
  }, [batches, batchId, getBatchById]);

  const handleEdit = (batch: IBatch) => {
    onEdit(batch.id);
  };

  const config = useCreateBatchDetailsConfig(
    batch,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    }
  );

  return (
    <Drawer
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
