export interface IWeekDay {
  id: number;
  name: string;
  dayNumber: number;
  isWorkingDay: boolean;
  remarks: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IWeekDayCreate {
  name: string;
  dayNumber: number;
  isWorkingDay: boolean;
  remarks: string;
  status: string;
}

export interface IWeekDayUpdate {
  name?: string;
  dayNumber?: number;
  isWorkingDay?: boolean;
  remarks?: string;
  status?: string;
}
