import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

import {IDepartment} from '@/types/department';

export const getDepartmentDisplayName = (department: IDepartment) => department.name;

export const useCreateDepartmentDetailsConfig = (
  department: IDepartment | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (department: IDepartment) => void;
  } = {},
) => {
  const { embedded = false, onEdit } = options;
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.DEPARTMENT, { defaultValue: 'Department' });
  return {
    name: entityName,
    route: '/departments',
    getDisplayName: getDepartmentDisplayName,
    getInitials: (department: IDepartment) => department.name.charAt(0).toUpperCase(),
    item: department,
    loading,
    error,
    embedded,
    onEdit,
    fields: [
      { key: 'id', label: t(LOCALE_KEYS.ID) },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'code', label: t(LOCALE_KEYS.CODE) },
      {
        key: 'branch.name',
        label: t(LOCALE_KEYS.BRANCH),
        render: (value: string, item: IDepartment) => item?.branch?.name || 'N/A',
      },
      { key: 'headId', label: t(LOCALE_KEYS.HEAD) },
      { key: 'email', label: t(LOCALE_KEYS.EMAIL) },
      { key: 'phone', label: t(LOCALE_KEYS.PHONE) },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
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
