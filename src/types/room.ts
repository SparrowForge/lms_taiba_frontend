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

export interface IAvailableRoomsParams {
  timeSlotId: number;
  date: string; // Format: YYYY-MM-DD
  excludeRoomId?: string; // Comma-separated IDs like "1,2,3"
  minSittingCapacity?: number;
  minExamCapacity?: number;
}
