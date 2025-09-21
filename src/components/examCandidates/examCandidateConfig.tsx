import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IExamCandidate } from '@/types/examCandidate';

export const getExamCandidateDisplayName = (examCandidate: IExamCandidate) => {
  return examCandidate.rollNo || `Exam Candidate #${examCandidate.id}`;
};

export const getExamCandidateInitials = (examCandidate: IExamCandidate) => {
  return examCandidate.rollNo?.slice(0, 2).toUpperCase() || 'EC';
};

export const useCreateExamCandidateDetailsConfig = (
  examCandidate: IExamCandidate | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (examCandidate: IExamCandidate) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IExamCandidate> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.EXAM_CANDIDATE),
    route: '/exam-candidates',
    getDisplayName: getExamCandidateDisplayName,
    getInitials: getExamCandidateInitials,
    item: examCandidate,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: t(LOCALE_KEYS.ID) },
      { key: 'examId', label: t(LOCALE_KEYS.EXAM_ID) },
      { key: 'studentId', label: t(LOCALE_KEYS.STUDENT_ID) },
      { key: 'rollNo', label: t(LOCALE_KEYS.ROLL_NO) },
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
