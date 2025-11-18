import {EntityStatus} from '@/enums/status';

import {IAddress} from './address';

export interface IInstitute {
  id: number;
  name: string;
  code: string;
  type: string;
  addressId: number;
  website: string;
  institutionCode: string;
  status: EntityStatus;
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
  status: EntityStatus;
}

export interface IInstituteUpdate {
  name?: string;
  code?: string;
  type?: string;
  addressId?: number;
  website?: string;
  institutionCode?: string;
  status?: EntityStatus;
}
