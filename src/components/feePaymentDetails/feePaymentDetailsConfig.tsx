import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IFeePaymentDetails } from '@/types/feePaymentDetails';

export const getFeePaymentDetailsDisplayName = (item: IFeePaymentDetails) =>
  item.feeTitle || `Payment Detail #${item.id}`;

export const getFeePaymentDetailsInitials = (item: IFeePaymentDetails) => {
  if (item.feeTitle) {
    return item.feeTitle.slice(0, 2).toUpperCase();
  }
  return 'FD';
};

export const useCreateFeePaymentDetailsDetailsConfig = (
  item: IFeePaymentDetails | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (fpd: IFeePaymentDetails) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IFeePaymentDetails> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.FEE_PAYMENT_DETAILS, { defaultValue: 'Fee Payment Details' }),
    route: '/fee-payment-details',
    getDisplayName: getFeePaymentDetailsDisplayName,
    getInitials: getFeePaymentDetailsInitials,
    item,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      {
        key: 'paymentId',
        label: t(LOCALE_KEYS.PAYMENT_ID, { defaultValue: 'Payment ID' }),
      },
      {
        key: 'feeInstallmentPlan',
        label: t(LOCALE_KEYS.FEE_INSTALLMENT_PLAN, { defaultValue: 'Fee Installment Plan' }),
        render: (feeInstallmentPlan: any) =>
          feeInstallmentPlan ? feeInstallmentPlan.paymentLabel : 'N/A',
      },
      {
        key: 'feeTitle',
        label: t(LOCALE_KEYS.FEE_TITLE, { defaultValue: 'Fee Title' }),
      },
      {
        key: 'amountDue',
        label: t(LOCALE_KEYS.AMOUNT_DUE, { defaultValue: 'Amount Due' }),
        render: (amount: number) => amount?.toLocaleString() || 'N/A',
      },
      {
        key: 'amountPaid',
        label: t(LOCALE_KEYS.AMOUNT_PAID),
        render: (amount: number) => amount?.toLocaleString() || 'N/A',
      },
      {
        key: 'balanceAmount',
        label: t(LOCALE_KEYS.BALANCE_AMOUNT, { defaultValue: 'Balance Amount' }),
        render: (amount: number) => amount?.toLocaleString() || 'N/A',
      },
      {
        key: 'createdAt',
        label: t(LOCALE_KEYS.CREATED_AT),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
      {
        key: 'updatedAt',
        label: t(LOCALE_KEYS.UPDATED_AT),
        render: (v: string) => (v ? new Date(v).toLocaleString() : 'N/A'),
      },
    ],
  };
};
