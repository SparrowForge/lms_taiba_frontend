export interface IDiscountTemplate {
  id: number;
  name: string;
  type: 'percent' | 'fixed' | string;
  amount: number;
  status: string;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IDiscountTemplateCreate {
  name: string;
  type: 'percent' | 'fixed' | string;
  amount: number;
  status: string;
  remarks?: string | null;
}

export interface IDiscountTemplateUpdate {
  name?: string;
  type?: 'percent' | 'fixed' | string;
  amount?: number;
  status?: string;
  remarks?: string | null;
}

