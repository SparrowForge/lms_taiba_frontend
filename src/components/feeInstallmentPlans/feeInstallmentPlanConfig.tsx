import {useTranslations} from 'next-intl';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {IFeeInstallmentPlan} from '@/types/feeInstallmentPlan';

export const getFeeInstallmentPlanDisplayName = (feeInstallmentPlan: IFeeInstallmentPlan) => {
  return feeInstallmentPlan.paymentLabel || `Fee Installment Plan #${feeInstallmentPlan.id}`;
};

export const getFeeInstallmentPlanInitials = (feeInstallmentPlan: IFeeInstallmentPlan) => {
  return feeInstallmentPlan.paymentLabel?.slice(0, 2).toUpperCase() || 'FI';
};

export const useCreateFeeInstallmentPlanDetailsConfig = (
  feeInstallmentPlan: IFeeInstallmentPlan | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (feeInstallmentPlan: IFeeInstallmentPlan) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IFeeInstallmentPlan> => {
  const { embedded = false, onEdit, onBack } = options;
  const t = useTranslations();
  return {
    name: t('feeInstallmentPlan'),
    route: '/fee-installment-plans',
    getDisplayName: getFeeInstallmentPlanDisplayName,
    getInitials: getFeeInstallmentPlanInitials,
    item: feeInstallmentPlan,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'feeStructure.templateName', label: t('fee_structure') },
      { key: 'sequenceNo', label: t('sequence_no') },
      { key: 'paymentLabel', label: t('payment_label') },
      { key: 'semester.name', label: t('semester') },
      { key: 'durationMonths', label: t('durationMonths') },
      { key: 'amount', label: t('amount') },
      { key: 'discountAmount', label: t('discountAmount') },
      {
        key: 'dueDate',
        label: t('dueDate'),
        render: (value: string) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
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
