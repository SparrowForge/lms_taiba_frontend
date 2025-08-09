'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useAddresses} from '@/hooks/useAddresses';

import {IAddress} from '@/types/address';

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
  const [initialValues, setInitialValues] = useState<Partial<IAddress> | undefined>();
  const { addresses, getAddressById, loadAddress } = useAddresses();
  const t = useTranslations();
  const entityName = t('address', { defaultValue: 'Address' });
  useEffect(() => {
    if (visible && mode === 'edit' && addressId) {
      const existing = getAddressById(addressId);
      if (existing) {
        setInitialValues(existing);
      } else {
        loadAddress(addressId);
      }
    } else {
      setInitialValues(undefined);
    }
  }, [visible, mode, addressId, getAddressById, loadAddress]);

  useEffect(() => {
    if (mode === 'edit' && addressId && addresses.length > 0) {
      const found = getAddressById(addressId);
      if (found) {
        setInitialValues(found);
      }
    }
  }, [addresses, addressId, mode, getAddressById]);

  const handleSuccess = () => {
    onSuccess();
    setInitialValues(undefined);
  };

  const handleCancel = () => {
    onCancel();
    setInitialValues(undefined);
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
      <AddressForm
        mode={mode}
        addressId={addressId}
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default AddressFormDrawer;
