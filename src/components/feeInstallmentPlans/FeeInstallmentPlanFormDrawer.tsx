'use client';

import {Drawer} from 'antd';
import dayjs from 'dayjs';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useFeeInstallmentPlans} from '@/hooks/useFeeInstallmentPlans';
import {useLocalization} from '@/hooks/useLocalization';

import {IFeeInstallmentPlanUpdate} from '@/types/feeInstallmentPlan';

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
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_INSTALLMENT_PLAN, { defaultValue: 'Fee Installment Plan' });
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
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
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
          dueDate: selectedFeeInstallmentPlan?.dueDate ? dayjs(selectedFeeInstallmentPlan.dueDate) : undefined,
        } as Partial<IFeeInstallmentPlanUpdate> : undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default FeeInstallmentPlanFormDrawer;
