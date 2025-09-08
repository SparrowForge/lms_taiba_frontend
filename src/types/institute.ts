import { IAddress } from './address';

export interface IInstitute {
  id: number;
  name: string;
  code: string;
  type: string;
  addressId: number;
  website: string;
  institutionCode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  address: IAddress;
}

export interface IInstituteCreate {
  name: string;
  code: string;
  type: string;
  addressId: number;
  website: string;
  institutionCode: string;
  status: string;
}

export interface IInstituteUpdate {
  name?: string;
  code?: string;
  type?: string;
  addressId?: number;
  website?: string;
  institutionCode?: string;
  status?: string;
}
