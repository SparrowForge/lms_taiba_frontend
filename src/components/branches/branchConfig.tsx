import { IBranch } from '@/types/branch';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';
import { useTranslations } from 'next-intl';

export const getBranchDisplayName = (branch: IBranch) => branch.name;

export const getBranchInitials = (branch: IBranch) => branch.name.charAt(0).toUpperCase();

export const createBranchDetailsConfig = (
  branch: IBranch | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (branch: IBranch) => void;
    onBack?: () => void;
  } = {}
): EntityDetailsConfig<IBranch> => {
  const { embedded = false, onEdit, onBack } = options;
  const t = useTranslations();

  return {
    name: t('branch'),
    route: '/branches',
    getDisplayName: getBranchDisplayName,
    getInitials: getBranchInitials,
    item: branch,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'name',
        label: t('name'),
      },
      {
        key: 'location',
        label: t('location'),
      },
      {
        key: 'code',
        label: t('code'),
      },
      {
        key: 'createdAt',
        label: t('createdAt'),
        render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A',
      },
      {
        key: 'updatedAt',
        label: t('updatedAt'),
        render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A',
      },
    ],
  };
};
