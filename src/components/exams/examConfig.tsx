import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IExam } from '@/types/exam';

export const getExamDisplayName = (exam: IExam) => {
  return exam.name || `Exam #${exam.id}`;
};

export const getExamInitials = (exam: IExam) => {
  return exam.name?.slice(0, 2).toUpperCase() || 'EX';
};

export const useCreateExamDetailsConfig = (
  exam: IExam | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (exam: IExam) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IExam> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t('exam'),
    route: '/exams',
    getDisplayName: getExamDisplayName,
    getInitials: getExamInitials,
    item: exam,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      {
        key: 'course',
        label: t(LOCALE_KEYS.COURSE),
        render: (course: any) => course?.name || 'N/A',
      },
      {
        key: 'subject',
        label: t(LOCALE_KEYS.SUBJECT),
        render: (subject: any) => subject?.name || 'N/A',
      },
      {
        key: 'semester',
        label: t(LOCALE_KEYS.SEMESTER),
        render: (semester: any) => semester?.name || 'N/A',
      },
      { key: 'batch', label: t(LOCALE_KEYS.BATCH), render: (batch: any) => batch?.name || 'N/A' },
      {
        key: 'examType',
        label: t(LOCALE_KEYS.EXAM_TYPE),
        render: (examType: any) => examType?.name || 'N/A',
      },
      { key: 'room', label: t(LOCALE_KEYS.ROOM), render: (room: any) => room?.name || 'N/A' },
      { key: 'marks', label: t(LOCALE_KEYS.MARKS) },
      {
        key: 'examDatetime',
        label: t(LOCALE_KEYS.EXAM_DATETIME),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
      {
        key: 'duration',
        label: t(LOCALE_KEYS.DURATION),
        render: (duration: any) => (duration ? `${duration.hours}h ${duration.minutes}m` : 'N/A'),
      },
      { key: 'questionType', label: t(LOCALE_KEYS.QUESTION_TYPE) },
      { key: 'questionsCount', label: t(LOCALE_KEYS.QUESTIONS_COUNT) },
      { key: 'optionsPerQuestion', label: t(LOCALE_KEYS.OPTIONS_PER_QUESTION) },
      { key: 'totalStudent', label: t(LOCALE_KEYS.TOTAL_STUDENT) },
      {
        key: 'isApproved',
        label: t(LOCALE_KEYS.IS_APPROVED),
        render: (value: boolean) => (value ? t(LOCALE_KEYS.YES) : t(LOCALE_KEYS.NO)),
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
