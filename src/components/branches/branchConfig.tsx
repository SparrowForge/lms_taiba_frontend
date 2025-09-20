import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IBranch } from '@/types/branch';

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
  const { t } = useLocalization();

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
        label: t(LOCALE_KEYS.ID),
      },
      {
        key: 'name',
        label: t(LOCALE_KEYS.NAME),
      },
      {
        key: 'code',
        label: t(LOCALE_KEYS.CODE),
      },
      {
        key: 'institute.name',
        label: t(LOCALE_KEYS.INSTITUTE),
        render: (value: string, item: IBranch) => item?.institute?.name || 'N/A',
      },
      {
        key: 'address.name',
        label: t(LOCALE_KEYS.ADDRESS),
        render: (value: string, item: IBranch) => item?.address?.name || 'N/A',
      },
      {
        key: 'externalInstituteIdNo',
        label: t(LOCALE_KEYS.EXTERNAL_INSTITUTE_ID_NO),
      },
      {
        key: 'campusDirector.name',
        label: t(LOCALE_KEYS.CAMPUS_DIRECTOR_USER_ID),
        render: (value: string, item: IBranch) => item?.campusDirector?.name || 'N/A',
      },
      {
        key: 'status',
        label: t(LOCALE_KEYS.STATUS),
      },
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
