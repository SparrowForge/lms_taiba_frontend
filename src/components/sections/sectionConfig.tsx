import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { ISection } from '@/types/section';

export const getSectionDisplayName = (section: ISection) => {
  return section.name || `Section #${section.id}`;
};

export const getSectionInitials = (section: ISection) => {
  return section.name?.slice(0, 2).toUpperCase() || 'SE';
};

export const useCreateSectionDetailsConfig = (
  section: ISection | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (section: ISection) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<ISection> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t('section'),
    route: '/sections',
    getDisplayName: getSectionDisplayName,
    getInitials: getSectionInitials,
    item: section,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'code', label: t(LOCALE_KEYS.CODE) },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
      { key: 'remarks', label: t(LOCALE_KEYS.REMARKS) },
      {
        key: 'batch.name',
        label: t(LOCALE_KEYS.BATCH),
        render: (value: string, item: ISection) => item?.batch?.name || 'N/A',
      },
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

