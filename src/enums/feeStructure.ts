import { IStatusOption } from '@/types/statusSelect';

export enum PaymentType {
  INSTALLMENT = 'installment',
  MONTHLY = 'monthly',
  ONE_TIME = 'one_time',
}

export enum DiscountType {
  FIXED = 'fixed',
  PERCENT = 'percent',
  NONE = 'none',
}

// Entity Status Options (Active/Inactive)
export const DISCOUNT_TYPE_OPTIONS: IStatusOption[] = Object.values(DiscountType).map((status) => ({
  key: `discount_type_${status}`,
  value: status,
  labelKey: `discount_type_${status}`,
}));

// Entity Status Options (Active/Inactive)
export const PAYMENT_TYPE_OPTIONS: IStatusOption[] = Object.values(PaymentType).map((status) => ({
  key: `payment_type_${status}`,
  value: status,
  labelKey: `payment_type_${status}`,
}));
