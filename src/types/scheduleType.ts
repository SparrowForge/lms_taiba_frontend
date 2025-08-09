export interface IScheduleType {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IScheduleTypeCreate {
  name: string;
  status: string;
}

export interface IScheduleTypeUpdate {
  name?: string;
  status?: string;
}
