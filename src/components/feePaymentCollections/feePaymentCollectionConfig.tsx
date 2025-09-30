import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IFeePaymentCollection } from '@/types/feePaymentCollection';

export const getFeePaymentCollectionDisplayName = (item: IFeePaymentCollection) =>
  item.student ? `${item.student.firstName} ${item.student.lastName}` : `Payment #${item.id}`;

export const getFeePaymentCollectionInitials = (item: IFeePaymentCollection) => {
  if (item.student) {
    return `${item.student.firstName?.charAt(0) || ''}${item.student.lastName?.charAt(0) || ''}`.toUpperCase();
  }
  return 'FP';
};

export const useCreateFeePaymentCollectionDetailsConfig = (
  item: IFeePaymentCollection | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (fpc: IFeePaymentCollection) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IFeePaymentCollection> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.FEE_PAYMENT_COLLECTION, { defaultValue: 'Fee Payment Collection' }),
    route: '/fee-payment-collections',
    getDisplayName: getFeePaymentCollectionDisplayName,
    getInitials: getFeePaymentCollectionInitials,
    item,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      {
        key: 'student',
        label: t(LOCALE_KEYS.STUDENT),
        render: (student: any) =>
          student ? `${student.firstName} ${student.lastName} (${student.applicationNo})` : 'N/A',
      },
      {
        key: 'feeStructure',
        label: t(LOCALE_KEYS.FEE_STRUCTURE),
        render: (feeStructure: any) => (feeStructure ? feeStructure.templateName : 'N/A'),
      },
      {
        key: 'paymentDate',
        label: t(LOCALE_KEYS.PAYMENT_DATE, { defaultValue: 'Payment Date' }),
        render: (v: string) => (v ? new Date(v).toLocaleDateString() : 'N/A'),
      },
      {
        key: 'paymentMode',
        label: t(LOCALE_KEYS.PAYMENT_MODE, { defaultValue: 'Payment Mode' }),
      },
      {
        key: 'transactionRef',
        label: t(LOCALE_KEYS.TRANSACTION_REF, { defaultValue: 'Transaction Reference' }),
      },
      {
        key: 'amountPaid',
        label: t(LOCALE_KEYS.AMOUNT_PAID, { defaultValue: 'Amount Paid' }),
        render: (amount: number, item: IFeePaymentCollection) =>
          `${item.currency} ${amount?.toLocaleString() || 'N/A'}`,
      },
      {
        key: 'currency',
        label: t(LOCALE_KEYS.CURRENCY),
      },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
      {
        key: 'remarks',
        label: t(LOCALE_KEYS.REMARKS),
        render: (v: string) => v || 'N/A',
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
