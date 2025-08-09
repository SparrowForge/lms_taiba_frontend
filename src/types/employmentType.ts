export interface IEmploymentType {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IEmploymentTypeCreate {
  name: string;
  status: string;
}

export interface IEmploymentTypeUpdate {
  name?: string;
  status?: string;
}
