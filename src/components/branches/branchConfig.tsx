import {useTranslations} from 'next-intl';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {IBranch} from '@/types/branch';

export const getBranchDisplayName = (branch: IBranch) => branch.name;

export const getBranchInitials = (branch: IBranch) => branch.name.charAt(0).toUpperCase();

export const useCreateBranchDetailsConfig = (
  branch: IBranch | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (branch: IBranch) => void;
    onBack?: () => void;
  } = {},
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
        key: 'code',
        label: t('code'),
      },
      {
        key: 'instituteId',
        label: t('instituteId'),
      },
      {
        key: 'addressId',
        label: t('address'),
      },
      {
        key: 'externalInstituteIdNo',
        label: t('externalInstituteIdNo'),
      },
      {
        key: 'campusDirectorUserId',
        label: t('campusDirectorUserId'),
      },
      {
        key: 'status',
        label: t('status'),
      },
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
