import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IExamMCQQuestion } from '@/types/examMCQQuestion';

export const getExamMCQQuestionDisplayName = (examMCQQuestion: IExamMCQQuestion) => {
  return (
    `Q${examMCQQuestion.questionOrder}: ${examMCQQuestion.questionText?.slice(0, 50)}...` ||
    `MCQ Question #${examMCQQuestion.id}`
  );
};

export const getExamMCQQuestionInitials = (examMCQQuestion: IExamMCQQuestion) => {
  return `Q${examMCQQuestion.questionOrder}` || 'MCQ';
};

export const useCreateExamMCQQuestionDetailsConfig = (
  examMCQQuestion: IExamMCQQuestion | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (examMCQQuestion: IExamMCQQuestion) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IExamMCQQuestion> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.EXAM_MCQ_QUESTION),
    route: '/exam-mcq-questions',
    getDisplayName: getExamMCQQuestionDisplayName,
    getInitials: getExamMCQQuestionInitials,
    item: examMCQQuestion,
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
