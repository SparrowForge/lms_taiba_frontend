'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useFeeStructures} from '@/hooks/useFeeStructures';

import FeeStructureForm from './FeeStructureForm';


interface FeeStructureFormDrawerProps {
  mode: 'create' | 'edit';
  feeStructureId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const FeeStructureFormDrawer: React.FC<FeeStructureFormDrawerProps> = ({
  mode,
  feeStructureId,
  visible,
  onCancel,
  onSuccess,
}) => {
 
  const { getFeeStructureById, selectedFeeStructure } = useFeeStructures();
  const t = useTranslations();
  const entityName = t('feeStructure', { defaultValue: 'Fee Structure' });
  useEffect(() => {
    if (visible && mode === 'edit' && feeStructureId) {
      getFeeStructureById(feeStructureId);
    }
  }, [visible, mode, feeStructureId, getFeeStructureById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
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
      <FeeStructureForm
        mode={mode}
        feeStructureId={feeStructureId}
        initialValues={selectedFeeStructure || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default FeeStructureFormDrawer;
