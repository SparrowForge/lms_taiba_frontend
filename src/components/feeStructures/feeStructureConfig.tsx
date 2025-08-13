import {useTranslations} from 'next-intl';

import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {IFeeStructure} from '@/types/feeStructure';

export const getFeeStructureDisplayName = (feeStructure: IFeeStructure) => {
  return feeStructure.template_name || `Fee Structure #${feeStructure.id}`;
};

export const getFeeStructureInitials = (feeStructure: IFeeStructure) => {
  return feeStructure.template_name?.slice(0, 2).toUpperCase() || 'FS';
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
      { key: 'template_name', label: t('templateName') },
      { key: 'batch.name', label: t('batch') },
      { key: 'semester.name', label: t('semester') },
      { key: 'academic_year', label: t('academicYear') },
      { key: 'payment_type', label: t('paymentType') },
      { key: 'total_fees', label: t('totalFees') },
      { key: 'admission_fee', label: t('admissionFee') },
      { key: 'discount_type', label: t('discountType') },
      { key: 'discount_amount', label: t('discountAmount') },
      { key: 'currency', label: t('currency') },
      { key: 'remarks', label: t('remarks') },
      { key: 'status', label: t('status') },
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
