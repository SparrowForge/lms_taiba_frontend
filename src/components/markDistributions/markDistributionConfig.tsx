import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IMarkDistribution } from '@/types/markDistribution';

export const getMarkDistributionDisplayName = (markDistribution: IMarkDistribution) => {
  return `Mark Distribution #${markDistribution.id}`;
};

export const getMarkDistributionInitials = (markDistribution: IMarkDistribution) => {
  return 'MD';
};

export const useCreateMarkDistributionDetailsConfig = (
  markDistribution: IMarkDistribution | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (markDistribution: IMarkDistribution) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IMarkDistribution> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t('mark_distribution'),
    route: '/mark-distributions',
    getDisplayName: getMarkDistributionDisplayName,
    getInitials: getMarkDistributionInitials,
    item: markDistribution,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'courseId', label: t(LOCALE_KEYS.COURSE_ID) },
      { key: 'subjectId', label: t(LOCALE_KEYS.SUBJECT_ID) },
      { key: 'examTypeId', label: t(LOCALE_KEYS.EXAM_TYPE_ID) },
      { key: 'weightage', label: t(LOCALE_KEYS.WEIGHTAGE) },
      { key: 'maxMarks', label: t(LOCALE_KEYS.MAX_MARKS) },
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
