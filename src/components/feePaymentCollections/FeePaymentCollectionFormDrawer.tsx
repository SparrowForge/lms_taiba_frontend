'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useFeePaymentCollections} from '@/hooks/useFeePaymentCollections';
import {useLocalization} from '@/hooks/useLocalization';

import FeePaymentCollectionForm from './FeePaymentCollectionForm';

interface Props {
  mode: 'create' | 'edit';
  feePaymentCollectionId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const FeePaymentCollectionFormDrawer: React.FC<Props> = ({
  mode,
  feePaymentCollectionId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { selectedFeePaymentCollection, loadFeePaymentCollection, detailsStatus } =
    useFeePaymentCollections();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_COLLECTION, {
    defaultValue: 'Fee Payment Collection',
  });

  useEffect(() => {
    if (visible && mode === 'edit' && feePaymentCollectionId) {
      loadFeePaymentCollection(feePaymentCollectionId);
    }
  }, [visible, mode, feePaymentCollectionId, loadFeePaymentCollection]);

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
      key={feePaymentCollectionId} // Force remount when feePaymentCollectionId changes
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
      <FeePaymentCollectionForm
        mode={mode}
        feePaymentCollectionId={feePaymentCollectionId}
        initialValues={selectedFeePaymentCollection || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default FeePaymentCollectionFormDrawer;
