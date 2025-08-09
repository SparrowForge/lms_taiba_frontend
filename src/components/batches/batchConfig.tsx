import {useTranslations} from 'next-intl';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

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
  const t = useTranslations();
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
      { key: 'id', label: 'ID' },
      { key: 'name', label: t('name') },
      { key: 'startDate', label: t('startDate') },
      { key: 'endDate', label: t('endDate') },
      { key: 'year', label: t('year') },
      { key: 'session', label: t('session') },
      { key: 'intakeCapacity', label: t('intakeCapacity') },
      { key: 'status', label: t('status') },
      { key: 'remarks', label: t('remarks') },
      {
        key: 'course.name',
        label: t('course'),
        render: (value: string, item: IBatch) => item?.course?.name || 'N/A',
      },
      {
        key: 'createdAt',
        label: t('createdAt'),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t('updatedAt'),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
    ],
  };
};
