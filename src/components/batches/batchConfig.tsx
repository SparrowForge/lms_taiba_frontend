import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';

import {IBatch} from '@/types/batch';

export const getBatchDisplayName = (batch: IBatch) => {
  return batch.name || `Batch #${batch.id}`;
};

export const getBatchInitials = (batch: IBatch) => {
  return batch.name?.slice(0, 2).toUpperCase() || 'BA';
};

export const useCreateBatchDetailsConfig = (
  batch: IBatch | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (batch: IBatch) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IBatch> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t('batch'),
    route: '/batches',
    getDisplayName: getBatchDisplayName,
    getInitials: getBatchInitials,
    item: batch,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      { key: 'startDate', label: t(LOCALE_KEYS.START_DATE) },
      { key: 'endDate', label: t(LOCALE_KEYS.END_DATE) },
      { key: 'year', label: t(LOCALE_KEYS.YEAR) },
      { key: 'session', label: t(LOCALE_KEYS.SESSION) },
      { key: 'intakeCapacity', label: t(LOCALE_KEYS.INTAKE_CAPACITY) },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
      { key: 'remarks', label: t(LOCALE_KEYS.REMARKS) },
      {
        key: 'course.name',
        label: t(LOCALE_KEYS.COURSE),
        render: (value: string, item: IBatch) => item?.course?.name || 'N/A',
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
