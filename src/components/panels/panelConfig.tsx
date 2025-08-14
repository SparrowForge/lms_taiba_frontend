import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

import {IPanel} from '@/types/panel';

export const getPanelDisplayName = (panel: IPanel) => panel.name;

export const useCreatePanelDetailsConfig = (
  panel: IPanel | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (panel: IPanel) => void;
  } = {},
) => {
  const { embedded = false, onEdit } = options;
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.PANEL, { defaultValue: 'Panel' });
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
      { key: 'id', label: t(LOCALE_KEYS.ID) },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
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
