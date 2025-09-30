'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useFeePaymentDetails } from '@/hooks/useFeePaymentDetails';
import { useLocalization } from '@/hooks/useLocalization';

import { IFeePaymentDetails } from '@/types/feePaymentDetails';

import { useCreateFeePaymentDetailsDetailsConfig } from './feePaymentDetailsConfig';

interface FeePaymentDetailsDetailsDrawerProps {
  feePaymentDetailId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (feePaymentDetailId: number) => void;
}

const FeePaymentDetailsDetailsDrawer: React.FC<FeePaymentDetailsDetailsDrawerProps> = ({
  feePaymentDetailId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedFeePaymentDetail, loadFeePaymentDetail, detailsStatus } = useFeePaymentDetails();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_DETAILS, { defaultValue: 'Fee Payment Details' });
  useEffect(() => {
    if (visible && feePaymentDetailId) {
      //getFeePaymentDetailById(feePaymentDetailId);
      loadFeePaymentDetail(feePaymentDetailId);
    }
  }, [visible, feePaymentDetailId, loadFeePaymentDetail]);

  const handleEdit = (feePaymentDetail: IFeePaymentDetails) => {
    onEdit(feePaymentDetail.id);
  };

  const config = useCreateFeePaymentDetailsDetailsConfig(
    selectedFeePaymentDetail,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={feePaymentDetailId} // Force remount when feePaymentDetailId changes
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

export default FeePaymentDetailsDetailsDrawer;
