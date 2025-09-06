'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useFeeStructures} from '@/hooks/useFeeStructures';
import {useLocalization} from '@/hooks/useLocalization';

import {Status} from '@/types/common';
import {IFeeStructure} from '@/types/feeStructure';

import {useCreateFeeStructureDetailsConfig} from './feeStructureConfig';

interface FeeStructureDetailsDrawerProps {
  feeStructureId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (feeStructureId: number) => void;
}

const FeeStructureDetailsDrawer: React.FC<FeeStructureDetailsDrawerProps> = ({
  feeStructureId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedFeeStructure, loadFeeStructure, detailsStatus } = useFeeStructures();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_STRUCTURE, { defaultValue: 'Fee Structure' });
  useEffect(() => {
    if (visible && feeStructureId) {
      //getFeeStructureById(feeStructureId);
      loadFeeStructure(feeStructureId);
    }
  }, [visible, feeStructureId, loadFeeStructure]);

  const handleEdit = (feeStructure: IFeeStructure) => {
    onEdit(feeStructure.id);
  };

  const config = useCreateFeeStructureDetailsConfig(
    selectedFeeStructure,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={feeStructureId} // Force remount when feeStructureId changes
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

export default FeeStructureDetailsDrawer;
