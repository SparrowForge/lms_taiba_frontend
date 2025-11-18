'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useFeePaymentCollections } from '@/hooks/useFeePaymentCollections';
import { useLocalization } from '@/hooks/useLocalization';

import { IFeePaymentCollection } from '@/types/feePaymentCollection';

import { useCreateFeePaymentCollectionDetailsConfig } from './feePaymentCollectionConfig';

interface FeePaymentCollectionDetailsDrawerProps {
  feePaymentCollectionId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (feePaymentCollectionId: number) => void;
}

const FeePaymentCollectionDetailsDrawer: React.FC<FeePaymentCollectionDetailsDrawerProps> = ({
  feePaymentCollectionId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedFeePaymentCollection, loadFeePaymentCollection, detailsStatus } =
    useFeePaymentCollections();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FEE_PAYMENT_COLLECTION, {
    defaultValue: 'Fee Payment Collection',
  });
  useEffect(() => {
    if (visible && feePaymentCollectionId) {
      //getFeePaymentCollectionById(feePaymentCollectionId);
      loadFeePaymentCollection(feePaymentCollectionId);
    }
  }, [visible, feePaymentCollectionId, loadFeePaymentCollection]);

  const handleEdit = (feePaymentCollection: IFeePaymentCollection) => {
    onEdit(feePaymentCollection.id);
  };

  const config = useCreateFeePaymentCollectionDetailsConfig(
    selectedFeePaymentCollection,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={feePaymentCollectionId} // Force remount when feePaymentCollectionId changes
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

export default FeePaymentCollectionDetailsDrawer;
