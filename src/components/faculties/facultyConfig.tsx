import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';

import {IFaculty} from '@/types/faculty';

export const getFacultyDisplayName = (faculty: IFaculty) => {
  return faculty.fullName || `Faculty #${faculty.id}`;
};

export const getFacultyInitials = (faculty: IFaculty) => {
  return faculty.fullName?.slice(0, 2).toUpperCase() || 'FA';
};

export const useCreateFacultyDetailsConfig = (
  faculty: IFaculty | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (faculty: IFaculty) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IFaculty> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.FACULTY),
    route: '/faculties',
    getDisplayName: getFacultyDisplayName,
    getInitials: getFacultyInitials,
    item: faculty,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'fullName', label: t(LOCALE_KEYS.FULL_NAME) },
      { key: 'email', label: t(LOCALE_KEYS.EMAIL) },
      { key: 'employeeCode', label: t(LOCALE_KEYS.EMPLOYEE_CODE) },
      { key: 'employmentType', label: t(LOCALE_KEYS.EMPLOYMENT_TYPE) },
      {
        key: 'isActive',
        label: t(LOCALE_KEYS.STATUS),
        render: (value: boolean) => (value ? t(LOCALE_KEYS.ACTIVE) : t(LOCALE_KEYS.INACTIVE)),
      },
      {
        key: 'joinedDate',
        label: t(LOCALE_KEYS.JOINED_DATE),
        render: (value: string) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
      },
      {
        key: 'branch.name',
        label: t(LOCALE_KEYS.BRANCH),
        render: (value: string, item: IFaculty) => item?.branch?.name || 'N/A',
      },
      {
        key: 'department.name',
        label: t(LOCALE_KEYS.DEPARTMENT),
        render: (value: string, item: IFaculty) => item?.department?.name || 'N/A',
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
