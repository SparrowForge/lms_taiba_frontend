import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IFeeInstallmentPlan } from '@/types/feeInstallmentPlan';

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
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.FEE_INSTALLMENT_PLAN),
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
      { key: 'feeStructure.templateName', label: t(LOCALE_KEYS.FEE_STRUCTURE) },
      { key: 'sequenceNo', label: t(LOCALE_KEYS.SEQUENCE_NO) },
      { key: 'paymentLabel', label: t(LOCALE_KEYS.PAYMENT_LABEL) },
      { key: 'semester.name', label: t(LOCALE_KEYS.SEMESTER) },
      { key: 'durationMonths', label: t(LOCALE_KEYS.DURATION_MONTHS) },
      { key: 'amount', label: t(LOCALE_KEYS.AMOUNT) },
      {
        key: 'dueDate',
        label: t(LOCALE_KEYS.DUE_DATE),
        render: (value: string) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
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
