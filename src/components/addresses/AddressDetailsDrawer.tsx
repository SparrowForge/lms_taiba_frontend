'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useAddresses} from '@/hooks/useAddresses';

import {IAddress} from '@/types/address';
import {Status} from '@/types/common';

import {useCreateAddressDetailsConfig} from './addressConfig';


interface AddressDetailsDrawerProps {
  addressId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (addressId: number) => void;
}

const AddressDetailsDrawer: React.FC<AddressDetailsDrawerProps> = ({
  addressId,
  visible,
  onClose,
  onEdit,
}) => {
  const [address, setAddress] = useState<IAddress | null>(null);
  const { addresses, getAddressById, loadAddress, detailsStatus } = useAddresses();
  const t = useTranslations();
  const entityName = t('address', { defaultValue: 'Address' });
  useEffect(() => {
    if (visible && addressId) {
      const existing = getAddressById(addressId);
      if (existing) {
        setAddress(existing);
      } else {
        loadAddress(addressId);
      }
    } else {
      setAddress(null);
    }
  }, [visible, addressId, getAddressById, loadAddress]);

  useEffect(() => {
    if (addressId && addresses.length > 0) {
      const found = getAddressById(addressId);
      if (found) {
        setAddress(found);
      }
    }
  }, [addresses, addressId, getAddressById]);

  const handleEdit = (address: IAddress) => {
    onEdit(address.id);
  };

  const config = useCreateAddressDetailsConfig(
    address,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
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

export default AddressDetailsDrawer;
