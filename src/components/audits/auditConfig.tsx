import {IAudit} from '@/types/audit';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';
import {useTranslations} from 'next-intl';

export const getAuditDisplayName = (audit: IAudit) => {
  return `${audit.action} - ${audit.resource} (${audit.username})`;
};

export const getAuditInitials = (audit: IAudit) => {
  return `${audit.action?.slice(0, 1) || 'A'}${audit.resource?.slice(0, 1) || 'R'}`;
};

export const createAuditDetailsConfig = (
  audit: IAudit | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (audit: IAudit) => void;
    onBack?: () => void;
  } = {}
): EntityDetailsConfig<IAudit> => {
  const { embedded = false, onEdit, onBack } = options;
  const t = useTranslations();
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
      { key: 'id', label: 'ID' },
      { key: 'userId', label: t('userId') },
      { key: 'username', label: t('username') },
      { key: 'action', label: t('action') },
      { key: 'resource', label: t('resource') },
      { key: 'resourceId', label: t('resourceId'), render: (value: number | null) => value || 'N/A' },
      { key: 'method', label: t('method') },
      { key: 'url', label: t('url') },
      { key: 'ip', label: t('ip') },
      { key: 'userAgent', label: t('userAgent') },
      { key: 'requestBody', label: t('requestBody'), render: (value: string | null) => value || 'N/A' },
      { key: 'responseStatus', label: t('responseStatus') },
      { key: 'responseTime', label: t('responseTime') },
      { key: 'success', label: t('success'), render: (value: boolean) => value ? t('yes') : t('no') },
      { key: 'error', label: t('error'), render: (value: string | null) => value || 'N/A' },
      { key: 'timestamp', label: t('timestamp'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
      { key: 'updatedAt', label: t('updatedAt'), render: (value: string) => value ? new Date(value).toLocaleString() : 'N/A' },
    ],
  };
}; 