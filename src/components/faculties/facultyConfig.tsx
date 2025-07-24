import {IFaculty} from '@/types/faculty';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';
import {useTranslations} from 'next-intl';

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
  } = {}
): EntityDetailsConfig<IFaculty> => {
  const { embedded = false, onEdit, onBack } = options;
  const t = useTranslations();
  return {
    name: t('faculty'),
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
      { key: 'fullName', label: t('fullName') },
      { key: 'email', label: t('email') },
      { key: 'employeeCode', label: t('employeeCode') },
      { key: 'employmentType', label: t('employmentType') },
      { key: 'isActive', label: t('status'), render: (value: boolean) => value ? t('active') : t('inactive') },
      { key: 'joinedDate', label: t('joinedDate'), render: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A' },
      { key: 'branch.name', label: t('branch'), render: (value: string, item: IFaculty) => item?.branch?.name || 'N/A' },
      { key: 'department.name', label: t('department'), render: (value: string, item: IFaculty) => item?.department?.name || 'N/A' },
      { key: 'createdAt', label: t('createdAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
      { key: 'updatedAt', label: t('updatedAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
    ],
  };
}; 