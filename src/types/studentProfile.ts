import {IAddress} from './address';
import {IStudent} from './student';

export interface IStudentProfile {
  id: number;
  studentId: number;
  dob: string;
  gender: string;
  maritalStatus: string;
  presentAddressId: number;
  permanentAddressId: number;
  phone: string;
  mobile: string;
  email: string;
  isTransferred: boolean;
  transferInfo: string | null;
  isInternational: boolean;
  identityType: string;
  identityNo: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  student: IStudent;
  presentAddress: IAddress;
  permanentAddress: IAddress;
}

export interface IStudentProfileCreate {
  studentId: number;
  dob: string;
  gender: string;
  maritalStatus: string;
  presentAddressId: number;
  permanentAddressId: number;
  phone: string;
  mobile: string;
  email: string;
  isTransferred: boolean;
  transferInfo?: string | null;
  isInternational: boolean;
  identityType: string;
  identityNo: string;
}

export interface IStudentProfileUpdate {
  studentId?: number;
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  presentAddressId?: number;
  permanentAddressId?: number;
  phone?: string;
  mobile?: string;
  email?: string;
  isTransferred?: boolean;
  transferInfo?: string | null;
  isInternational?: boolean;
  identityType?: string;
  identityNo?: string;
}
