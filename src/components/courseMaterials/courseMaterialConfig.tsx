import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';

import {ICourseMaterial} from '@/types/courseMaterial';

export const useCreateCourseMaterialDetailsConfig = (
  courseMaterial: ICourseMaterial | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (courseMaterial: ICourseMaterial) => void;
  } = {},
) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.COURSE_MATERIAL, { defaultValue: 'Course Material' });
  return {
    name: entityName,
    route: '/course-materials',
    getDisplayName: getCourseMaterialDisplayName,
    getInitials: (courseMaterial: ICourseMaterial) => courseMaterial.title.charAt(0).toUpperCase(),
    item: courseMaterial,
    loading,
    error,
    embedded: options.embedded || false,
    onEdit: options.onEdit,
    fields: [
      { key: 'title', label: t(LOCALE_KEYS.TITLE) },
      { key: 'description', label: t(LOCALE_KEYS.DESCRIPTION) },
      { key: 'course.name', label: t(LOCALE_KEYS.COURSE), render: (value: string, item: ICourseMaterial) => item?.course?.name || 'N/A' },
      { key: 'subject.name', label: t(LOCALE_KEYS.SUBJECT), render: (value: string, item: ICourseMaterial) => item?.subject?.name || 'N/A' },
      { key: 'semester.name', label: t(LOCALE_KEYS.SEMESTER), render: (value: string, item: ICourseMaterial) => item?.semester?.name || 'N/A' },
      { key: 'batch.name', label: t(LOCALE_KEYS.BATCH), render: (value: string, item: ICourseMaterial) => item?.batch?.name || 'N/A' },
      { key: 'faculty.fullName', label: t(LOCALE_KEYS.FACULTY), render: (value: string, item: ICourseMaterial) => item?.faculty?.fullName || 'N/A' },
      { key: 'type', label: t(LOCALE_KEYS.TYPE) },
      { key: 'fileId', label: t(LOCALE_KEYS.FILE_ID), render: (value: string, item: ICourseMaterial) => item?.fileId || 'N/A' },
      { key: 'isDownloadable', label: t(LOCALE_KEYS.IS_DOWNLOADABLE), render: (value: string, item: ICourseMaterial) => item?.isDownloadable ? 'Yes' : 'No' },
      { key: 'accessLevel', label: t(LOCALE_KEYS.ACCESS_LEVEL) },
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
  } as EntityDetailsConfig<ICourseMaterial>;
};

const getCourseMaterialDisplayName = (courseMaterial: ICourseMaterial) => {
  return courseMaterial.title;
};
