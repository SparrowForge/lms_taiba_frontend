import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IDuration, IExamType } from '@/types/examType';

export const getExamTypeDisplayName = (examType: IExamType) => {
  return examType.name || `Exam Type #${examType.id}`;
};

export const getExamTypeInitials = (examType: IExamType) => {
  return examType.name?.slice(0, 2).toUpperCase() || 'ET';
};

export const useCreateExamTypeDetailsConfig = (
  examType: IExamType | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (examType: IExamType) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IExamType> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t('exam_type'),
    route: '/exam-types',
    getDisplayName: getExamTypeDisplayName,
    getInitials: getExamTypeInitials,
    item: examType,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'code', label: t(LOCALE_KEYS.CODE) },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'marks', label: t(LOCALE_KEYS.MARKS) },
      {
        key: 'duration',
        label: t(LOCALE_KEYS.DURATION),
        render: (duration: IDuration) =>
          duration ? `${duration.hours}h ${duration.minutes}m` : 'N/A',
      },
      { key: 'contribution', label: t(LOCALE_KEYS.CONTRIBUTION) },
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
