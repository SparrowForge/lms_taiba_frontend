import { IStatusOption } from '@/types/statusSelect';

export enum PaymentMode {
  CASH = 'cash',
  CARD = 'card',
  BANK = 'bank',
  ONLINE = 'online',
  MOBILE = 'mobile',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Payment Mode Options with localization
export const PAYMENT_MODE_OPTIONS: IStatusOption[] = Object.values(PaymentMode).map((mode) => ({
  key: `payment_mode_${mode}`,
  value: mode,
  labelKey: `payment_mode_${mode}`,
}));

// Payment Status Options with localization
export const PAYMENT_STATUS_OPTIONS: IStatusOption[] = Object.values(PaymentStatus).map(
  (status) => ({
    key: `payment_status_${status}`,
    value: status,
    labelKey: `payment_status_${status}`,
  }),
);
