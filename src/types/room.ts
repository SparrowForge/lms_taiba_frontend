import { IRoomType } from './roomType';

export interface IRoom {
  id: number;
  name: string;
  roomTypeId: number;
  levelFloor: string;
  sittingCapacity: number;
  examCapacity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  roomType: IRoomType;
}

export interface IRoomCreate {
  name: string;
  roomTypeId: number;
  levelFloor: string;
  sittingCapacity: number;
  examCapacity: number;
  status: string;
}

export interface IRoomUpdate {
  name?: string;
  roomTypeId?: number;
  levelFloor?: string;
  sittingCapacity?: number;
  examCapacity?: number;
  status?: string;
}
