import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IExamResult } from '@/types/examResult';

export const getExamResultDisplayName = (examResult: IExamResult) => {
  return (
    `${examResult.grade} (${examResult.marksObtained} marks)` || `Exam Result #${examResult.id}`
  );
};

export const getExamResultInitials = (examResult: IExamResult) => {
  return examResult.grade?.slice(0, 2).toUpperCase() || 'ER';
};

export const useCreateExamResultDetailsConfig = (
  examResult: IExamResult | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (examResult: IExamResult) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IExamResult> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.EXAM_RESULT),
    route: '/exam-results',
    getDisplayName: getExamResultDisplayName,
    getInitials: getExamResultInitials,
    item: examResult,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: t(LOCALE_KEYS.ID) },
      { key: 'examId', label: t(LOCALE_KEYS.EXAM_ID) },
      { key: 'studentId', label: t(LOCALE_KEYS.STUDENT_ID) },
      { key: 'marksObtained', label: t(LOCALE_KEYS.MARKS_OBTAINED) },
      { key: 'grade', label: t(LOCALE_KEYS.GRADE) },
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
