export interface ICurrency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ICurrencyCreate {
  code: string;
  name: string;
  symbol: string;
  isDefault?: boolean;
}

export interface ICurrencyUpdate extends Partial<ICurrencyCreate> {}

export interface IExchangeRate {
  id: number;
  currency: ICurrency;
  rate: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface IExchangeRateCreate {
  currencyId: number;
  rate: number; // Rate relative to default currency
  date: string;
}
