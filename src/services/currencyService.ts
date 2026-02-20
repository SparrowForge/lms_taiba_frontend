import { api } from '@/lib/axios';
import { IBasePaginatedResponse, IBaseResponse } from '@/types/common';
import {
  ICurrency,
  ICurrencyCreate,
  ICurrencyUpdate,
  IExchangeRate,
  IExchangeRateCreate,
} from '@/types/currency';

export const currencyService = {
  // Get all currencies
  getCurrencies: async (params = {}): Promise<IBasePaginatedResponse<ICurrency>> => {
    const response = await api.get<IBasePaginatedResponse<ICurrency>>('/currencies', { params });
    return response.data;
  },

  // Get a single currency by ID
  getCurrency: async (id: number): Promise<IBaseResponse<ICurrency>> => {
    const response = await api.get<IBaseResponse<ICurrency>>(`/currencies/${id}`);
    return response.data;
  },

  // Create a new currency
  createCurrency: async (data: ICurrencyCreate): Promise<ICurrency> => {
    const response = await api.post<IBaseResponse<ICurrency>>('/currencies', data);
    return response.data.data;
  },

  // Update an existing currency
  updateCurrency: async (id: number, data: ICurrencyUpdate): Promise<ICurrency> => {
    const response = await api.patch<IBaseResponse<ICurrency>>(`/currencies/${id}`, data);
    return response.data.data;
  },

  // Delete a currency
  deleteCurrency: async (id: number): Promise<void> => {
    await api.delete<IBaseResponse<null>>(`/currencies/${id}`);
  },

  // Get exchange rates
  getExchangeRates: async (
    date?: string,
    params: { page?: number; limit?: number } = {},
  ): Promise<IBasePaginatedResponse<IExchangeRate>> => {
    const response = await api.get<IBasePaginatedResponse<IExchangeRate>>(
      `/currencies/exchange-rates`,
      {
        params: { date, ...params },
      },
    );
    return response.data;
  },

  // Save exchange rates
  saveExchangeRates: async (rates: IExchangeRateCreate[]): Promise<IExchangeRate[]> => {
    const response = await api.post<IBaseResponse<IExchangeRate[]>>(
      `/currencies/exchange-rates`,
      rates,
    );
    return response.data.data;
  },
};
