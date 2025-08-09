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
