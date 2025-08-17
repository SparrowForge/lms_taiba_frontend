export interface IRoomType {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IRoomTypeCreate {
  name: string;
  status: string;
}

export interface IRoomTypeUpdate {
  name?: string;
  status?: string;
}
