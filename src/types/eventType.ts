export interface IEventType {
  id: number;
  name: string;
  color: string;
  status: string;
  remarks: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IEventTypeCreate {
  name: string;
  color: string;
  status: string;
  remarks: string;
  sortOrder: number;
}

export interface IEventTypeUpdate {
  name?: string;
  color?: string;
  status?: string;
  remarks?: string;
  sortOrder?: number;
}

