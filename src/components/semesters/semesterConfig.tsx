import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { ISemester } from '@/types/semester';

export const getSemesterDisplayName = (semester: ISemester) => {
  return semester.name || `Semester #${semester.id}`;
};

export const getSemesterInitials = (semester: ISemester) => {
  return semester.name?.slice(0, 2).toUpperCase() || 'SE';
};

export const useCreateSemesterDetailsConfig = (
  semester: ISemester | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (semester: ISemester) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<ISemester> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.SEMESTER, { defaultValue: 'Semester' }),
    route: '/semesters',
    getDisplayName: getSemesterDisplayName,
    getInitials: getSemesterInitials,
    item: semester,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'termNo', label: t(LOCALE_KEYS.TERM_NO) },
      { key: 'startDate', label: t(LOCALE_KEYS.START_DATE) },
      { key: 'endDate', label: t(LOCALE_KEYS.END_DATE) },
      {
        key: 'batch.name',
        label: t(LOCALE_KEYS.BATCH),
        render: (value: string, item: ISemester) => item?.batch?.name || 'N/A',
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
