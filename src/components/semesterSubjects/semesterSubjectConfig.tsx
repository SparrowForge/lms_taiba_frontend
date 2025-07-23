import {ISemesterSubject} from '@/types/semesterSubject';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';
import {useTranslations} from 'next-intl';

export const getSemesterSubjectDisplayName = (semesterSubject: ISemesterSubject) => {
  return `${semesterSubject.semester?.name || 'Semester'} - ${semesterSubject.subject?.name || 'Subject'}`;
};

export const getSemesterSubjectInitials = (semesterSubject: ISemesterSubject) => {
  return `${semesterSubject.semester?.name?.slice(0, 1) || 'S'}${semesterSubject.subject?.name?.slice(0, 1) || 'S'}`;
};

export const createSemesterSubjectDetailsConfig = (
  semesterSubject: ISemesterSubject | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (semesterSubject: ISemesterSubject) => void;
    onBack?: () => void;
  } = {}
): EntityDetailsConfig<ISemesterSubject> => {
  const { embedded = false, onEdit, onBack } = options;
  const t = useTranslations();
  return {
    name: t('semesterSubject'),
    route: '/semester-subjects',
    getDisplayName: getSemesterSubjectDisplayName,
    getInitials: getSemesterSubjectInitials,
    item: semesterSubject,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'semester.name', label: t('semester'), render: (value: string, item: ISemesterSubject) => item?.semester?.name || 'N/A' },
      { key: 'subject.name', label: t('subject'), render: (value: string, item: ISemesterSubject) => item?.subject?.name || 'N/A' },
      { key: 'subject.code', label: t('subjectCode'), render: (value: string, item: ISemesterSubject) => item?.subject?.code || 'N/A' },
      { key: 'subject.creditHours', label: t('creditHours'), render: (value: string, item: ISemesterSubject) => item?.subject?.creditHours || 'N/A' },
      { key: 'createdAt', label: t('createdAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
      { key: 'updatedAt', label: t('updatedAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
    ],
  };
}; 