import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';

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
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.COURSE_TYPE),
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
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
      {
        key: 'createdAt',
        label: t(LOCALE_KEYS.CREATED_AT),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t(LOCALE_KEYS.UPDATED_AT),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
    ],
  };
};
