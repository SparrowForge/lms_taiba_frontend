import {useTranslations} from 'next-intl';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

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
  const t = useTranslations();
  return {
    name: t('employmentType'),
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
      { key: 'name', label: t('name') },
      { key: 'status', label: t('status') },
      {
        key: 'createdAt',
        label: t('createdAt'),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t('updatedAt'),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
    ],
  };
};
