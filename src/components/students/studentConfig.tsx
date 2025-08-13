import {useTranslations} from 'next-intl';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {IStudent} from '@/types/student';

export const getStudentDisplayName = (student: IStudent) => {
  return student.name || `Student #${student.id}`;
};

export const getStudentInitials = (student: IStudent) => {
  return student.name?.slice(0, 2).toUpperCase() || 'ST';
};

export const useCreateStudentDetailsConfig = (
  student: IStudent | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (student: IStudent) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IStudent> => {
  const { embedded = false, onEdit, onBack } = options;
  const t = useTranslations();
  return {
    name: t('student'),
    route: '/students',
    getDisplayName: getStudentDisplayName,
    getInitials: getStudentInitials,
    item: student,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'applicationNo', label: t('application_no') },
      { key: 'name', label: t('name') },
      { key: 'cardNo', label: t('card_no') },
      { key: 'registrationNo', label: t('registration_no') },
      { key: 'admissionDate', label: t('admission_date') },
      { key: 'course.name', label: t('course') },
      { key: 'batch.name', label: t('batch') },
      { key: 'branch.name', label: t('branch') },
      { key: 'referenceNo', label: t('reference_no') },
      { key: 'admissionSource', label: t('admission_source') },
      { key: 'status', label: t('status') },
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
