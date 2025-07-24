import {IPanel} from '@/types/panel';
import {useTranslations} from 'next-intl';

export const getPanelDisplayName = (panel: IPanel) => panel.name;

export const useCreatePanelDetailsConfig = (
  panel: IPanel | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (panel: IPanel) => void;
  } = {}
) => {
  const { embedded = false, onEdit } = options;
  const t = useTranslations();
  const entityName = t('panel', { defaultValue: 'Panel' });
  return {
    name: entityName,
    route: '/panels',
    getDisplayName: getPanelDisplayName,
    getInitials: (panel: IPanel) => panel.name.charAt(0).toUpperCase(),
    item: panel,
    loading,
    error,
    embedded,
    onEdit,
    fields: [
      { key: 'id', label: t('id') },
      { key: 'name', label: t('name') },
      { key: 'createdAt', label: t('createdAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
      { key: 'updatedAt', label: t('updatedAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
    ],
  };
};
