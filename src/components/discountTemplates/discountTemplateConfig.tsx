import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { IDiscountTemplate } from '@/types/discountTemplate';

export const getDiscountTemplateDisplayName = (item: IDiscountTemplate) =>
  item.name || `Discount Template #${item.id}`;

export const getDiscountTemplateInitials = (item: IDiscountTemplate) =>
  item.name?.slice(0, 2).toUpperCase() || 'DT';

export const useCreateDiscountTemplateDetailsConfig = (
  item: IDiscountTemplate | null,
  loading: boolean,
  error: string | null,
  options: { embedded?: boolean; onEdit?: (dt: IDiscountTemplate) => void; onBack?: () => void } = {},
): EntityDetailsConfig<IDiscountTemplate> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();

  return {
    name: t(LOCALE_KEYS.DISCOUNT_TEMPLATE, { defaultValue: 'Discount Template' }),
    route: '/discount-templates',
    getDisplayName: getDiscountTemplateDisplayName,
    getInitials: getDiscountTemplateInitials,
    item,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: t(LOCALE_KEYS.NAME) },
      {
        key: 'type',
        label: t(LOCALE_KEYS.TYPE, { defaultValue: 'Type' }),
      },
      {
        key: 'amount',
        label: t(LOCALE_KEYS.DISCOUNT_AMOUNT, { defaultValue: 'Discount Amount' }),
      },
      {
        key: 'status',
        label: t(LOCALE_KEYS.STATUS),
      },
      {
        key: 'remarks',
        label: t(LOCALE_KEYS.REMARKS, { defaultValue: 'Remarks' }),
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

