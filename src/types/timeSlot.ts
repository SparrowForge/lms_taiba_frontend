export interface ITimeSlot {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ITimeSlotCreate {
  name: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface ITimeSlotUpdate {
  name?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
}
