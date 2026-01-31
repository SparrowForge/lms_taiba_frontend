import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IExamQuestion } from '@/types/examQuestion';

export const getExamQuestionDisplayName = (examQuestion: IExamQuestion) => {
  return (
    `Q${examQuestion.questionOrder}: ${examQuestion.questionText?.slice(0, 50)}...` ||
    `Question #${examQuestion.id}`
  );
};

export const getExamQuestionInitials = (examQuestion: IExamQuestion) => {
  return `Q${examQuestion.questionOrder}` || 'Q';
};

export const useCreateExamQuestionDetailsConfig = (
  examQuestion: IExamQuestion | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (examQuestion: IExamQuestion) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IExamQuestion> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.EXAM_QUESTION),
    route: '/exam-questions',
    getDisplayName: getExamQuestionDisplayName,
    getInitials: getExamQuestionInitials,
    item: examQuestion,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: t(LOCALE_KEYS.ID) },
      { key: 'examId', label: t(LOCALE_KEYS.EXAM_ID) },
      { key: 'questionOrder', label: t(LOCALE_KEYS.QUESTION_ORDER) },
      { key: 'questionText', label: t(LOCALE_KEYS.QUESTION_TEXT) },
      { key: 'correctOptionNumber', label: t(LOCALE_KEYS.CORRECT_OPTION_NUMBER) },
      {
        key: 'options',
        label: t(LOCALE_KEYS.OPTIONS),
        render: (value: string[]) => value?.join(', ') || 'N/A',
      },
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
