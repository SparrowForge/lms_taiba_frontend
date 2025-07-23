import {ISemester} from '@/types/semester';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';
import {useTranslations} from 'next-intl';

export const getSemesterDisplayName = (semester: ISemester) => {
  return semester.name || `Semester #${semester.id}`;
};

export const getSemesterInitials = (semester: ISemester) => {
  return semester.name?.slice(0, 2).toUpperCase() || 'SE';
};

export const createSemesterDetailsConfig = (
  semester: ISemester | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (semester: ISemester) => void;
    onBack?: () => void;
  } = {}
): EntityDetailsConfig<ISemester> => {
  const { embedded = false, onEdit, onBack } = options;
  const t = useTranslations();
  return {
    name: t('semester'),
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
      { key: 'name', label: t('name') },
      { key: 'termNo', label: t('termNo') },
      { key: 'startDate', label: t('startDate') },
      { key: 'endDate', label: t('endDate') },
      { key: 'batch.name', label: t('batch'), render: (value: string, item: ISemester) => item?.batch?.name || 'N/A' },
      { key: 'createdAt', label: t('createdAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
      { key: 'updatedAt', label: t('updatedAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
    ],
  };
};
