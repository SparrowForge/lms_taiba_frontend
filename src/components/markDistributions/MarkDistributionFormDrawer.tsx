'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useLocalization } from '@/hooks/useLocalization';
import { useMarkDistributions } from '@/hooks/useMarkDistributions';

import MarkDistributionForm from './MarkDistributionForm';

interface MarkDistributionFormDrawerProps {
  mode: 'create' | 'edit';
  markDistributionId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const MarkDistributionFormDrawer: React.FC<MarkDistributionFormDrawerProps> = ({
  mode,
  markDistributionId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { selectedMarkDistribution, loadMarkDistribution, detailsStatus } =
    useMarkDistributions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.MARK_DISTRIBUTION, { defaultValue: 'Mark Distribution' });
  useEffect(() => {
    if (visible && mode === 'edit' && markDistributionId) {
      loadMarkDistribution(markDistributionId);
    }
  }, [visible, mode, markDistributionId, loadMarkDistribution]);

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
      key={markDistributionId} // Force remount when markDistributionId changes
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
      <MarkDistributionForm
        mode={mode}
        markDistributionId={markDistributionId}
        initialValues={selectedMarkDistribution || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default MarkDistributionFormDrawer;
