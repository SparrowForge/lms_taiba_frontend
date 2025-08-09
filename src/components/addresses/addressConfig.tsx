import {useTranslations} from 'next-intl';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {IAddress} from '@/types/address';

export const getAddressDisplayName = (address: IAddress) => {
  return address.name || `Address #${address.id}`;
};

export const getAddressInitials = (address: IAddress) => {
  return address.name?.slice(0, 2).toUpperCase() || 'AD';
};

export const useCreateAddressDetailsConfig = (
  address: IAddress | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (address: IAddress) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IAddress> => {
  const { embedded = false, onEdit, onBack } = options;
  const t = useTranslations();
  return {
    name: t('address'),
    route: '/addresses',
    getDisplayName: getAddressDisplayName,
    getInitials: getAddressInitials,
    item: address,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: t('name') },
      { key: 'address', label: t('address') },
      { key: 'city', label: t('city') },
      { key: 'state', label: t('state') },
      { key: 'zipCode', label: t('zipCode') },
      { key: 'country', label: t('country') },
      { key: 'phone', label: t('phone') },
      { key: 'email', label: t('email') },
      {
        key: 'createdAt',
        label: t('createdAt'),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t('updatedAt'),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
    ],
  };
};
