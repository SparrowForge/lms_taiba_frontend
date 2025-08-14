'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useFeeStructures} from '@/hooks/useFeeStructures';
import {useLocalization} from '@/hooks/useLocalization';

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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_STRUCTURE, { defaultValue: 'Fee Structure' });
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
      key={feeStructureId} // Force remount when feeStructureId changes
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
