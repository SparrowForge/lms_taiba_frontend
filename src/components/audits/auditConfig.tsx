import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';

import {IAudit} from '@/types/audit';

export const getAuditDisplayName = (audit: IAudit) => {
  return `${audit.action} - ${audit.resource} (${audit.username})`;
};

export const getAuditInitials = (audit: IAudit) => {
  return `${audit.action?.slice(0, 1) || 'A'}${audit.resource?.slice(0, 1) || 'R'}`;
};

export const useCreateAuditDetailsConfig = (
  audit: IAudit | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (audit: IAudit) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IAudit> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t('audit'),
    route: '/audit',
    getDisplayName: getAuditDisplayName,
    getInitials: getAuditInitials,
    item: audit,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'userId', label: t(LOCALE_KEYS.USER_ID) },
      { key: 'username', label: t(LOCALE_KEYS.USERNAME) },
      { key: 'action', label: t(LOCALE_KEYS.ACTION) },
      { key: 'resource', label: t(LOCALE_KEYS.RESOURCE) },
      {
        key: 'resourceId',
        label: t(LOCALE_KEYS.RESOURCE_ID),
        render: (value: number | null) => value || 'N/A',
      },
      { key: 'method', label: t(LOCALE_KEYS.METHOD) },
      { key: 'url', label: t(LOCALE_KEYS.URL) },
      { key: 'ip', label: t(LOCALE_KEYS.IP) },
      { key: 'userAgent', label: t(LOCALE_KEYS.USER_AGENT) },
      {
        key: 'requestBody',
        label: t(LOCALE_KEYS.REQUEST_BODY),
        render: (value: string | null) => value || 'N/A',
      },
      { key: 'responseStatus', label: t(LOCALE_KEYS.RESPONSE_STATUS) },
      { key: 'responseTime', label: t(LOCALE_KEYS.RESPONSE_TIME) },
      {
        key: 'success',
        label: t(LOCALE_KEYS.SUCCESS),
        render: (value: boolean) => (value ? t(LOCALE_KEYS.YES) : t(LOCALE_KEYS.NO)),
      },
      {
        key: 'error',
        label: t(LOCALE_KEYS.ERROR),
        render: (value: string | null) => value || 'N/A',
      },
      {
        key: 'timestamp',
        label: t(LOCALE_KEYS.TIMESTAMP),
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
