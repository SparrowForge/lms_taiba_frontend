import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';

import {IEmploymentType} from '@/types/employmentType';

export const getEmploymentTypeDisplayName = (item: IEmploymentType) =>
  item.name || `Employment Type #${item.id}`;
export const getEmploymentTypeInitials = (item: IEmploymentType) =>
  item.name?.slice(0, 2).toUpperCase() || 'ET';

export const useCreateEmploymentTypeDetailsConfig = (
  item: IEmploymentType | null,
  loading: boolean,
  error: string | null,
  options: { embedded?: boolean; onEdit?: (et: IEmploymentType) => void; onBack?: () => void } = {},
): EntityDetailsConfig<IEmploymentType> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.EMPLOYMENT_TYPE),
    route: '/employment-types',
    getDisplayName: getEmploymentTypeDisplayName,
    getInitials: getEmploymentTypeInitials,
    item,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
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
