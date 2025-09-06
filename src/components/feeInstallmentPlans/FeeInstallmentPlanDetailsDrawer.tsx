'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useFeeInstallmentPlans} from '@/hooks/useFeeInstallmentPlans';
import {useLocalization} from '@/hooks/useLocalization';

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
  const { selectedFeeInstallmentPlan, loadFeeInstallmentPlan, detailsStatus } =
    useFeeInstallmentPlans();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_INSTALLMENT_PLAN, { defaultValue: 'Fee Installment Plan' });
  useEffect(() => {
    if (visible && feeInstallmentPlanId) {
      //getFeeInstallmentPlanById(feeInstallmentPlanId);
      loadFeeInstallmentPlan(feeInstallmentPlanId);
    }
  }, [visible, feeInstallmentPlanId, loadFeeInstallmentPlan]);

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

export default FeeInstallmentPlanDetailsDrawer;
