'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useFeeInstallmentPlans} from '@/hooks/useFeeInstallmentPlans';

import {Status} from '@/types/common';
import {IFeeInstallmentPlan} from '@/types/feeInstallmentPlan';

import {useCreateFeeInstallmentPlanDetailsConfig} from './feeInstallmentPlanConfig';


interface FeeInstallmentPlanDetailsDrawerProps {
  feeInstallmentPlanId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (feeInstallmentPlanId: number) => void;
}

const FeeInstallmentPlanDetailsDrawer: React.FC<FeeInstallmentPlanDetailsDrawerProps> = ({
  feeInstallmentPlanId,
  visible,
  onClose,
  onEdit,
}) => {
  
  const { selectedFeeInstallmentPlan, getFeeInstallmentPlanById, detailsStatus } = useFeeInstallmentPlans();
  const t = useTranslations();
  const entityName = t('feeInstallmentPlan', { defaultValue: 'Fee Installment Plan' });
  useEffect(() => {
    if (visible && feeInstallmentPlanId) {
      getFeeInstallmentPlanById(feeInstallmentPlanId);
    }
  }, [visible, feeInstallmentPlanId, getFeeInstallmentPlanById]);

  const handleEdit = (feeInstallmentPlan: IFeeInstallmentPlan) => {
    onEdit(feeInstallmentPlan.id);
  };

  const config = useCreateFeeInstallmentPlanDetailsConfig(
    selectedFeeInstallmentPlan,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={feeInstallmentPlanId} // Force remount when feeInstallmentPlanId changes
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

export default FeeInstallmentPlanDetailsDrawer;
