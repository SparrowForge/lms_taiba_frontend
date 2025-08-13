'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useFeeStructures} from '@/hooks/useFeeStructures';

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
  
  const { selectedFeeStructure, getFeeStructureById, detailsStatus } = useFeeStructures();
  const t = useTranslations();
  const entityName = t('feeStructure', { defaultValue: 'Fee Structure' });
  useEffect(() => {
    if (visible && feeStructureId) {
      getFeeStructureById(feeStructureId);
    }
  }, [visible, feeStructureId, getFeeStructureById]);

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

export default FeeStructureDetailsDrawer;
