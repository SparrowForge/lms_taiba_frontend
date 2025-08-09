import {useTranslations} from 'next-intl';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

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
  const t = useTranslations();
  return {
    name: t('institute'),
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
