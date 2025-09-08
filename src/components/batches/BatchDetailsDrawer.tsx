'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useBatches} from '@/hooks/useBatches';
import {useLocalization} from '@/hooks/useLocalization';

import {IBatch} from '@/types/batch';

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
  const { selectedBatch, loadBatch, detailsStatus } = useBatches();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.BATCH, { defaultValue: 'Batch' });
  useEffect(() => {
    if (visible && batchId) {
      //getBatchById(batchId);
      loadBatch(batchId);
    }
  }, [visible, batchId, loadBatch]);

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
      title={t(LOCALE_KEYS.DETAILS_NAME, { name: entityName })}
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
