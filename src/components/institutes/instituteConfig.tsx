import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';

import {IInstitute} from '@/types/institute';

export const getInstituteDisplayName = (item: IInstitute) => item.name || `Institute #${item.id}`;
export const getInstituteInitials = (item: IInstitute) =>
  item.name?.slice(0, 2).toUpperCase() || 'IN';

export const useCreateInstituteDetailsConfig = (
  item: IInstitute | null,
  loading: boolean,
  error: string | null,
  options: { embedded?: boolean; onEdit?: (it: IInstitute) => void; onBack?: () => void } = {},
): EntityDetailsConfig<IInstitute> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.INSTITUTE),
    route: '/institutes',
    getDisplayName: getInstituteDisplayName,
    getInitials: getInstituteInitials,
    item,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'code', label: t(LOCALE_KEYS.INSTITUTE_CODE) },
      { key: 'type', label: t(LOCALE_KEYS.INSTITUTE_TYPE) },
      { key: 'institutionCode', label: t(LOCALE_KEYS.INSTITUTION_CODE) },
      { key: 'website', label: t(LOCALE_KEYS.WEBSITE) },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
      {
        key: 'address',
        label: t(LOCALE_KEYS.ADDRESS),
        render: (address: any) => address ? `${address.name} - ${address.address}` : 'N/A',
      },
      {
        key: 'createdAt',
        label: t(LOCALE_KEYS.CREATED_AT),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t(LOCALE_KEYS.UPDATED_AT),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
    ],
  };
};
