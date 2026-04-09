export interface IVoucherType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface IVoucherTypeCreate {
  name: string;
}

export interface IVoucherTypeUpdate extends Partial<IVoucherTypeCreate> {
  id: number;
}
