import { EntityStatus } from '@/enums/status';

import { IExam } from './exam';
import { IFaculty } from './faculty';
import { IRoom } from './room';
import { ITimeSlot } from './timeSlot';
import { IWeekDay } from './weekDay';

export interface IExamSchedule {
  id: number;
  examId: number;
  roomId: number;
  facultyId: number;
  weekDayId: number;
  timeSlotId: number;
  remarks: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  exam: IExam;
  room: IRoom;
  faculty: IFaculty;
  weekDay: IWeekDay;
  timeSlot: ITimeSlot;
}

export interface IExamScheduleCreate {
  examId: number;
  roomId: number;
  facultyId: number;
  weekDayId: number;
  timeSlotId: number;
  remarks?: string;
  status: EntityStatus;
}

export interface IExamScheduleUpdate {
  examId?: number;
  roomId?: number;
  facultyId?: number;
  weekDayId?: number;
  timeSlotId?: number;
  remarks?: string;
  status?: EntityStatus;
}
