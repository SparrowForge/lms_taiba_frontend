'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';
import { useMarkDistributions } from '@/hooks/useMarkDistributions';

import { IMarkDistribution } from '@/types/markDistribution';

import { useCreateMarkDistributionDetailsConfig } from './markDistributionConfig';

interface MarkDistributionDetailsDrawerProps {
  markDistributionId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (markDistributionId: number) => void;
}

const MarkDistributionDetailsDrawer: React.FC<MarkDistributionDetailsDrawerProps> = ({
  markDistributionId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedMarkDistribution, loadMarkDistribution, detailsStatus } = useMarkDistributions();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.MARK_DISTRIBUTION, { defaultValue: 'Mark Distribution' });
  useEffect(() => {
    if (visible && markDistributionId) {
      //getMarkDistributionById(markDistributionId);
      loadMarkDistribution(markDistributionId);
    }
  }, [visible, markDistributionId, loadMarkDistribution]);

  const handleEdit = (markDistribution: IMarkDistribution) => {
    onEdit(markDistribution.id);
  };

  const config = useCreateMarkDistributionDetailsConfig(
    selectedMarkDistribution,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={markDistributionId} // Force remount when markDistributionId changes
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

export default MarkDistributionDetailsDrawer;
