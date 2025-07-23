import {IFacultySubject} from '@/types/facultySubject';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';
import {useTranslations} from 'next-intl';

export const getFacultySubjectDisplayName = (facultySubject: IFacultySubject) => {
  return `${facultySubject.faculty?.fullName || 'Faculty'} - ${facultySubject.subject?.name || 'Subject'}`;
};

export const getFacultySubjectInitials = (facultySubject: IFacultySubject) => {
  return `${facultySubject.faculty?.fullName?.slice(0, 1) || 'F'}${facultySubject.subject?.name?.slice(0, 1) || 'S'}`;
};

export const createFacultySubjectDetailsConfig = (
  facultySubject: IFacultySubject | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (facultySubject: IFacultySubject) => void;
    onBack?: () => void;
  } = {}
): EntityDetailsConfig<IFacultySubject> => {
  const { embedded = false, onEdit, onBack } = options;
  const t = useTranslations();
  return {
    name: t('facultySubject'),
    route: '/faculty-subjects',
    getDisplayName: getFacultySubjectDisplayName,
    getInitials: getFacultySubjectInitials,
    item: facultySubject,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'faculty.fullName', label: t('faculty'), render: (value: string, item: IFacultySubject) => item?.faculty?.fullName || 'N/A' },
      { key: 'subject.name', label: t('subject'), render: (value: string, item: IFacultySubject) => item?.subject?.name || 'N/A' },
      { key: 'subject.code', label: t('subjectCode'), render: (value: string, item: IFacultySubject) => item?.subject?.code || 'N/A' },
      { key: 'semester.name', label: t('semester'), render: (value: string, item: IFacultySubject) => item?.semester?.name || 'N/A' },
      { key: 'batch.name', label: t('batch'), render: (value: string, item: IFacultySubject) => item?.batch?.name || 'N/A' },
      { key: 'hoursPerWeek', label: t('hoursPerWeek') },
      { key: 'role', label: t('role') },
      { key: 'createdAt', label: t('createdAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
      { key: 'updatedAt', label: t('updatedAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
    ],
  };
}; 