import {useTranslations} from 'next-intl';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {ICourseType} from '@/types/courseType';

export const getCourseTypeDisplayName = (item: ICourseType) =>
  item.name || `Course Type #${item.id}`;
export const getCourseTypeInitials = (item: ICourseType) =>
  item.name?.slice(0, 2).toUpperCase() || 'CT';

export const useCreateCourseTypeDetailsConfig = (
  item: ICourseType | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (ct: ICourseType) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<ICourseType> => {
  const { embedded = false, onEdit, onBack } = options;
  const t = useTranslations();
  return {
    name: t('courseType'),
    route: '/course-types',
    getDisplayName: getCourseTypeDisplayName,
    getInitials: getCourseTypeInitials,
    item,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: t('name') },
      { key: 'status', label: t('status') },
      {
        key: 'createdAt',
        label: t('createdAt'),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t('updatedAt'),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
    ],
  };
};
