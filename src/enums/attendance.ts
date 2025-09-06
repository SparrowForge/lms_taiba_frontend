import { IStatusOption } from '@/types/statusSelect';

export enum CaptureMethod {
  QR = 'q',
  RFID = 'r',
  BIOMETRIC = 'b',
  MANUAL = 'm',
  MOBILE_APP = 'a',
}

// Entity Status Options (Active/Inactive)
export const CAPTURE_METHOD_OPTIONS: IStatusOption[] = Object.values(CaptureMethod).map(
  (status) => ({
    key: `capture_method_${status}`,
    value: status,
    labelKey: `capture_method_${status}`,
  }),
);
