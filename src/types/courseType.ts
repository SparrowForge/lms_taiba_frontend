export interface ICourseType {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ICourseTypeCreate {
  name: string;
  status: string;
}

export interface ICourseTypeUpdate {
  name?: string;
  status?: string;
}
