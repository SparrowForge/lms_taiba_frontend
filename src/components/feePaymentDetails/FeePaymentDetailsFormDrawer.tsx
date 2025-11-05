'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useFeePaymentDetails} from '@/hooks/useFeePaymentDetails';
import {useLocalization} from '@/hooks/useLocalization';

import FeePaymentDetailsForm from './FeePaymentDetailsForm';

interface Props {
  mode: 'create' | 'edit';
  feePaymentDetailId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const FeePaymentDetailsFormDrawer: React.FC<Props> = ({
  mode,
  feePaymentDetailId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { selectedFeePaymentDetail, loadFeePaymentDetail, detailsStatus } = useFeePaymentDetails();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_DETAILS, { defaultValue: 'Fee Payment Details' });

  useEffect(() => {
    if (visible && mode === 'edit' && feePaymentDetailId) {
      loadFeePaymentDetail(feePaymentDetailId);
    }
  }, [visible, mode, feePaymentDetailId, loadFeePaymentDetail]);

  const handleSuccess = () => {
    onSuccess();
  };
  const handleCancel = () => {
    onCancel();
  };

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
  }

  return (
    <Drawer
      key={feePaymentDetailId} // Force remount when feePaymentDetailId changes
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
      <FeePaymentDetailsForm
        mode={mode}
        feePaymentDetailId={feePaymentDetailId}
        initialValues={selectedFeePaymentDetail || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default FeePaymentDetailsFormDrawer;
