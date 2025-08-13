'use client';

import {Drawer} from 'antd';
import dayjs from 'dayjs';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useFeeInstallmentPlans} from '@/hooks/useFeeInstallmentPlans';

import { IFeeInstallmentPlanUpdate } from '@/types/feeInstallmentPlan';

import FeeInstallmentPlanForm from './FeeInstallmentPlanForm';


interface FeeInstallmentPlanFormDrawerProps {
  mode: 'create' | 'edit';
  feeInstallmentPlanId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const FeeInstallmentPlanFormDrawer: React.FC<FeeInstallmentPlanFormDrawerProps> = ({
  mode,
  feeInstallmentPlanId,
  visible,
  onCancel,
  onSuccess,
}) => {
 
  const { getFeeInstallmentPlanById, selectedFeeInstallmentPlan } = useFeeInstallmentPlans();
  const t = useTranslations();
  const entityName = t('feeInstallmentPlan', { defaultValue: 'Fee Installment Plan' });
  useEffect(() => {
    if (visible && mode === 'edit' && feeInstallmentPlanId) {
      getFeeInstallmentPlanById(feeInstallmentPlanId);
    }
  }, [visible, mode, feeInstallmentPlanId, getFeeInstallmentPlanById]);

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
      <FeeInstallmentPlanForm
        mode={mode}
        feeInstallmentPlanId={feeInstallmentPlanId}
        initialValues={mode === 'edit' ? {
          ...selectedFeeInstallmentPlan,
          due_date: selectedFeeInstallmentPlan?.due_date ? dayjs(selectedFeeInstallmentPlan.due_date) : undefined,
        } as Partial<IFeeInstallmentPlanUpdate> : undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default FeeInstallmentPlanFormDrawer;
