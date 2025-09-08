import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IAddress } from '@/types/address';

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
  const { t } = useLocalization();
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
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'address', label: t(LOCALE_KEYS.ADDRESS) },
      { key: 'city', label: t(LOCALE_KEYS.CITY) },
      { key: 'state', label: t(LOCALE_KEYS.STATE) },
      { key: 'zipCode', label: t(LOCALE_KEYS.ZIP_CODE) },
      { key: 'country', label: t(LOCALE_KEYS.COUNTRY) },
      { key: 'phone', label: t(LOCALE_KEYS.PHONE) },
      { key: 'email', label: t(LOCALE_KEYS.EMAIL) },
      {
        key: 'createdAt',
        label: t(LOCALE_KEYS.CREATED_AT),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t(LOCALE_KEYS.UPDATED_AT),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
    ],
  };
};
