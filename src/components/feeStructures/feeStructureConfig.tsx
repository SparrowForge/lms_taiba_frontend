import {useTranslations} from 'next-intl';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

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
  const t = useTranslations();
  return {
    name: t('feeStructure'),
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
      { key: 'templateName', label: t('template_name') },
      { key: 'batchName', label: t('batch') },
      { key: 'semesterName', label: t('semester') },
      { key: 'academicYear', label: t('academic_year') },
      { key: 'paymentType', label: t('payment_type') },
      { key: 'totalFees', label: t('total_fees') },
      { key: 'admissionFee', label: t('admission_fee') },
      { key: 'discountType', label: t('discount_type') },
      { key: 'discountAmount', label: t('discount_amount') },
      { key: 'currency', label: t('currency') },
      { key: 'remarks', label: t('remarks') },
      { key: 'status', label: t('status') },
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
