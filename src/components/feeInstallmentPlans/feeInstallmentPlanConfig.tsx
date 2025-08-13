import {useTranslations} from 'next-intl';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {IFeeInstallmentPlan} from '@/types/feeInstallmentPlan';

export const getFeeInstallmentPlanDisplayName = (feeInstallmentPlan: IFeeInstallmentPlan) => {
  return feeInstallmentPlan.payment_label || `Fee Installment Plan #${feeInstallmentPlan.id}`;
};

export const getFeeInstallmentPlanInitials = (feeInstallmentPlan: IFeeInstallmentPlan) => {
  return feeInstallmentPlan.payment_label?.slice(0, 2).toUpperCase() || 'FI';
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
      { key: 'fee_structure.template_name', label: t('feeStructure') },
      { key: 'sequence_no', label: t('sequenceNo') },
      { key: 'payment_label', label: t('paymentLabel') },
      { key: 'semester.name', label: t('semester') },
      { key: 'duration_months', label: t('durationMonths') },
      { key: 'amount', label: t('amount') },
      { key: 'discount_amount', label: t('discountAmount') },
      {
        key: 'due_date',
        label: t('dueDate'),
        render: (value: string) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
      },
      {
        key: 'created_at',
        label: t('createdAt'),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
      {
        key: 'updated_at',
        label: t('updatedAt'),
        render: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
    ],
  };
};
