export enum SecurityType {
  PASSWORD = 'password',
  TOKEN = 'token',
  BIOMETRIC = 'biometric',
  NONE = 'none',
}

export const SECURITY_TYPE_OPTIONS = [
  {
    key: 'security_type_password',
    value: SecurityType.PASSWORD,
    labelKey: 'security_type_password',
  },
  { key: 'security_type_token', value: SecurityType.TOKEN, labelKey: 'security_type_token' },
  {
    key: 'security_type_biometric',
    value: SecurityType.BIOMETRIC,
    labelKey: 'security_type_biometric',
  },
  { key: 'security_type_none', value: SecurityType.NONE, labelKey: 'security_type_none' },
];
