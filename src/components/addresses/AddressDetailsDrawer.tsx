'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useAddresses} from '@/hooks/useAddresses';
import {useLocalization} from '@/hooks/useLocalization';

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

  const { selectedAddress, getAddressById, detailsStatus } = useAddresses();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ADDRESS, { defaultValue: 'Address' });
  useEffect(() => {
    if (visible && addressId) {
      getAddressById(addressId);
    }
  }, [visible, addressId, getAddressById]);

  const handleEdit = (address: IAddress) => {
    onEdit(address.id);
  };

  const config = useCreateAddressDetailsConfig(
    selectedAddress,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={addressId} // Force remount when addressId changes
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

export default AddressDetailsDrawer;
