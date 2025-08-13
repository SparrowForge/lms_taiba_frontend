import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';

import {IFeeStructure} from '@/types/feeStructure';

export const getFeeStructureDisplayName = (feeStructure: IFeeStructure) => {
  return feeStructure.templateName || `Fee Structure #${feeStructure.id}`;
};

export const getFeeStructureInitials = (feeStructure: IFeeStructure) => {
  return feeStructure.templateName?.slice(0, 2).toUpperCase() || 'FS';
};

export const useCreateFeeStructureDetailsConfig = (
  feeStructure: IFeeStructure | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (feeStructure: IFeeStructure) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<IFeeStructure> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();
  return {
    name: t(LOCALE_KEYS.FEE_STRUCTURE),
    route: '/fee-structures',
    getDisplayName: getFeeStructureDisplayName,
    getInitials: getFeeStructureInitials,
    item: feeStructure,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'templateName', label: t(LOCALE_KEYS.TEMPLATE_NAME) },
      { key: 'batchName', label: t(LOCALE_KEYS.BATCH) },
      { key: 'semesterName', label: t(LOCALE_KEYS.SEMESTER) },
      { key: 'academicYear', label: t(LOCALE_KEYS.ACADEMIC_YEAR) },
      { key: 'paymentType', label: t(LOCALE_KEYS.PAYMENT_TYPE) },
      { key: 'totalFees', label: t(LOCALE_KEYS.TOTAL_FEES) },
      { key: 'admissionFee', label: t(LOCALE_KEYS.ADMISSION_FEE) },
      { key: 'discountType', label: t(LOCALE_KEYS.DISCOUNT_TYPE) },
      { key: 'discountAmount', label: t(LOCALE_KEYS.DISCOUNT_AMOUNT) },
      { key: 'currency', label: t(LOCALE_KEYS.CURRENCY) },
      { key: 'remarks', label: t(LOCALE_KEYS.REMARKS) },
      { key: 'status', label: t(LOCALE_KEYS.STATUS) },
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
