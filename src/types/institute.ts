export interface IInstitute {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IInstituteCreate {
  name: string;
  status: string;
}

export interface IInstituteUpdate {
  name?: string;
  status?: string;
}
