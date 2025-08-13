'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useAddresses} from '@/hooks/useAddresses';

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
 
  const { getAddressById, selectedAddress } = useAddresses();
  const t = useTranslations();
  const entityName = t('address', { defaultValue: 'Address' });
  useEffect(() => {
    if (visible && mode === 'edit' && addressId) {
      getAddressById(addressId);
    }
  }, [visible, mode, addressId, getAddressById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={addressId} // Force remount when addressId changes
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
