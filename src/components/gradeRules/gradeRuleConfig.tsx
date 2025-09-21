import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IGradeRule } from '@/types/gradeRule';

export const getGradeRuleDisplayName = (gradeRule: IGradeRule) => {
  return gradeRule.grade || `Grade Rule #${gradeRule.id}`;
};

export const getGradeRuleInitials = (gradeRule: IGradeRule) => {
  return gradeRule.grade?.slice(0, 2).toUpperCase() || 'GR';
};

export const useCreateGradeRuleDetailsConfig = (
  gradeRule: IGradeRule | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (gradeRule: IGradeRule) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IGradeRule> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t('grade_rule'),
    route: '/grade-rules',
    getDisplayName: getGradeRuleDisplayName,
    getInitials: getGradeRuleInitials,
    item: gradeRule,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'grade', label: t(LOCALE_KEYS.GRADE) },
      { key: 'courseId', label: t(LOCALE_KEYS.COURSE_ID) },
      { key: 'minMarks', label: t(LOCALE_KEYS.MIN_MARKS) },
      { key: 'maxMarks', label: t(LOCALE_KEYS.MAX_MARKS) },
      { key: 'gradePoint', label: t(LOCALE_KEYS.GRADE_POINT) },
      { key: 'remarks', label: t(LOCALE_KEYS.REMARKS) },
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
