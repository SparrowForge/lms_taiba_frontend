import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { IStudentFamily } from '@/types/studentFamily';

export const getStudentFamilyDisplayName = (studentFamily: IStudentFamily) => {
  return studentFamily.student?.name || `Student Family #${studentFamily.id}`;
};

export const getStudentFamilyInitials = (studentFamily: IStudentFamily) => {
  return studentFamily.student?.name?.slice(0, 2).toUpperCase() || 'SF';
};

export const useCreateStudentFamilyDetailsConfig = (
  studentFamily: IStudentFamily | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (studentFamily: IStudentFamily) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IStudentFamily> => {
  const { embedded = false, onEdit, onBack } = options;
  return {
    name: LOCALE_KEYS.STUDENT_FAMILY,
    route: '/student-families',
    getDisplayName: getStudentFamilyDisplayName,
    getInitials: getStudentFamilyInitials,
    item: studentFamily,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'student.name', label: LOCALE_KEYS.STUDENT },
      { key: 'fatherName', label: LOCALE_KEYS.FATHER_NAME },
      { key: 'fatherAddress', label: LOCALE_KEYS.FATHER_ADDRESS },
      { key: 'fatherPhone', label: LOCALE_KEYS.FATHER_PHONE },
      { key: 'fatherEmail', label: LOCALE_KEYS.FATHER_EMAIL },
      { key: 'motherName', label: LOCALE_KEYS.MOTHER_NAME },
      { key: 'motherPhone', label: LOCALE_KEYS.MOTHER_PHONE },
      { key: 'motherEmail', label: LOCALE_KEYS.MOTHER_EMAIL },
      { key: 'noOfSiblings', label: LOCALE_KEYS.NO_OF_SIBLINGS },
      { key: 'siblingsIds', label: LOCALE_KEYS.SIBLINGS_IDS },
      {
        key: 'createdAt',
        label: LOCALE_KEYS.CREATED_AT,
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: LOCALE_KEYS.UPDATED_AT,
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
    ],
  };
};
