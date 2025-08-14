import {IAddress} from './address';
import {IInstitute} from './institute';
import {IUser} from './user';

export interface IBranch {
  id: number;
  name: string;
  code: string;
  instituteId: number;
  addressId: number;
  externalInstituteIdNo: string;
  campusDirectorUserId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  address: IAddress;
  institute: IInstitute;
  campusDirector: IUser;
}

export interface IBranchCreate {
  name: string;
  code: string;
  instituteId: number;
  addressId: number;
  externalInstituteIdNo: string;
  campusDirectorUserId: number;
  status: string;
}

export interface IBranchUpdate {
  name?: string;
  code?: string;
  instituteId?: number;
  addressId?: number;
  externalInstituteIdNo?: string;
  campusDirectorUserId?: number;
  status?: string;
}
