import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IStudent } from '@/types/student';

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
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.STUDENT, { defaultValue: 'Student' }),
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
      { key: 'applicationNo', label: t(LOCALE_KEYS.APPLICATION_NO) },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'cardNo', label: t(LOCALE_KEYS.CARD_NO) },
      { key: 'registrationNo', label: t(LOCALE_KEYS.REGISTRATION_NO) },
      { key: 'admissionDate', label: t(LOCALE_KEYS.ADMISSION_DATE) },
      { key: 'course.name', label: t(LOCALE_KEYS.COURSE) },
      { key: 'batch.name', label: t(LOCALE_KEYS.BATCH) },
      { key: 'branch.name', label: t(LOCALE_KEYS.BRANCH) },
      { key: 'referenceNo', label: t(LOCALE_KEYS.REFERENCE_NO) },
      { key: 'admissionSource', label: t(LOCALE_KEYS.ADMISSION_SOURCE) },
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
