'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useAddresses} from '@/hooks/useAddresses';
import {useLocalization} from '@/hooks/useLocalization';

import AddressForm from './AddressForm';

interface AddressFormDrawerProps {
  mode: 'create' | 'edit';
  addressId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const AddressFormDrawer: React.FC<AddressFormDrawerProps> = ({
  mode,
  addressId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getAddressById, selectedAddress, loadAddress, detailsStatus } = useAddresses();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ADDRESS, { defaultValue: 'Address' });
  useEffect(() => {
    if (visible && mode === 'edit' && addressId) {
      //getAddressById(addressId);
      loadAddress(addressId);
    }
  }, [visible, mode, addressId, loadAddress]);

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
      key={addressId} // Force remount when addressId changes
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
      <AddressForm
        mode={mode}
        addressId={addressId}
        initialValues={selectedAddress || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default AddressFormDrawer;
