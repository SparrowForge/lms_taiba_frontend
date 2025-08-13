import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {IStudentProfile} from '@/types/studentProfile';

export const getStudentProfileDisplayName = (studentProfile: IStudentProfile) => {
  return studentProfile.student?.name || `Student Profile #${studentProfile.id}`;
};

export const getStudentProfileInitials = (studentProfile: IStudentProfile) => {
  return studentProfile.student?.name?.slice(0, 2).toUpperCase() || 'SP';
};

export const useCreateStudentProfileDetailsConfig = (
  studentProfile: IStudentProfile | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (studentProfile: IStudentProfile) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IStudentProfile> => {
  const { embedded = false, onEdit, onBack } = options;
  return {
    name: LOCALE_KEYS.STUDENT_PROFILE,
    route: '/student-profiles',
    getDisplayName: getStudentProfileDisplayName,
    getInitials: getStudentProfileInitials,
    item: studentProfile,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'student.name', label: LOCALE_KEYS.STUDENT },
      { key: 'dob', label: LOCALE_KEYS.DATE_OF_BIRTH },
      { key: 'gender', label: LOCALE_KEYS.GENDER },
      { key: 'maritalStatus', label: LOCALE_KEYS.MARITAL_STATUS },
      { key: 'presentAddress.name', label: LOCALE_KEYS.PRESENT_ADDRESS },
      { key: 'permanentAddress.name', label: LOCALE_KEYS.PERMANENT_ADDRESS },
      { key: 'phone', label: LOCALE_KEYS.PHONE },
      { key: 'mobile', label: LOCALE_KEYS.MOBILE },
      { key: 'email', label: LOCALE_KEYS.EMAIL },
      { key: 'isTransferred', label: LOCALE_KEYS.IS_TRANSFERRED },
      { key: 'transferInfo', label: LOCALE_KEYS.TRANSFER_INFO },
      { key: 'isInternational', label: LOCALE_KEYS.IS_INTERNATIONAL },
      { key: 'identityType', label: LOCALE_KEYS.IDENTITY_TYPE },
      { key: 'identityNo', label: LOCALE_KEYS.IDENTITY_NO },
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
