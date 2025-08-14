import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';

import {IFacultySubject} from '@/types/facultySubject';

export const getFacultySubjectDisplayName = (facultySubject: IFacultySubject) => {
  return `${facultySubject.faculty?.fullName || 'Faculty'} - ${facultySubject.subject?.name || 'Subject'}`;
};

export const getFacultySubjectInitials = (facultySubject: IFacultySubject) => {
  return `${facultySubject.faculty?.fullName?.slice(0, 1) || 'F'}${facultySubject.subject?.name?.slice(0, 1) || 'S'}`;
};

export const useCreateFacultySubjectDetailsConfig = (
  facultySubject: IFacultySubject | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (facultySubject: IFacultySubject) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IFacultySubject> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.FACULTY_SUBJECT),
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
      {
        key: 'faculty.fullName',
        label: t(LOCALE_KEYS.FACULTY),
        render: (value: string, item: IFacultySubject) => item?.faculty?.fullName || 'N/A',
      },
      {
        key: 'subject.name',
        label: t(LOCALE_KEYS.SUBJECT),
        render: (value: string, item: IFacultySubject) => item?.subject?.name || 'N/A',
      },
      {
        key: 'subject.code',
        label: t(LOCALE_KEYS.SUBJECT_CODE),
        render: (value: string, item: IFacultySubject) => item?.subject?.code || 'N/A',
      },
      {
        key: 'semester.name',
        label: t(LOCALE_KEYS.SEMESTER),
        render: (value: string, item: IFacultySubject) => item?.semester?.name || 'N/A',
      },
      {
        key: 'batch.name',
        label: t(LOCALE_KEYS.BATCH),
        render: (value: string, item: IFacultySubject) => item?.batch?.name || 'N/A',
      },
      { key: 'hoursPerWeek', label: t(LOCALE_KEYS.HOURS_PER_WEEK) },
      { key: 'role', label: t(LOCALE_KEYS.ROLE) },
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
