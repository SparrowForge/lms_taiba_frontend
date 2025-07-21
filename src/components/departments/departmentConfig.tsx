import {IDepartment} from '@/types/department';
import {useTranslations} from 'next-intl';

export const getDepartmentDisplayName = (department: IDepartment) => department.name;

export const createDepartmentDetailsConfig = (
  department: IDepartment | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (department: IDepartment) => void;
  } = {}
) => {
  const { embedded = false, onEdit } = options;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations();
  const entityName = t('department', { defaultValue: 'Department' });
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
      { key: 'id', label: t('id') },
      { key: 'name', label: t('name') },
      { key: 'code', label: t('code') },
      { key: 'branch.name', label: t('branch'), render: (value: string, item: IDepartment) => item?.branch?.name || 'N/A' },
      { key: 'createdAt', label: t('createdAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
      { key: 'updatedAt', label: t('updatedAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
    ],
  };
};
