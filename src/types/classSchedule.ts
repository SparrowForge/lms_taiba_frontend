import {IBatch} from './batch';
import {IFaculty} from './faculty';
import {IRoom} from './room';
import {IScheduleType} from './scheduleType';
import {ISemester} from './semester';
import {ISubject} from './subject';
import {ITimeSlot} from './timeSlot';
import {IWeekDay} from './weekDay';

export interface IClassSchedule {
  id: number;
  batchId: number;
  semesterId: number;
  subjectId: number;
  weekDayId: number;
  roomId: number;
  facultyId: number;
  timeSlotId: number;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  scheduleTypeId: number;
  scheduleType: IScheduleType;
  maxCapacity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  batch: IBatch;
  semester: ISemester;
  subject: ISubject;
  weekDay: IWeekDay;
  room: IRoom;
  faculty: IFaculty;
  timeSlot: ITimeSlot;
}

export interface IClassScheduleCreate {
  batchId: number;
  semesterId: number;
  subjectId: number;
  weekDayId: number;
  roomId: number;
  facultyId: number;
  timeSlotId: number;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  scheduleTypeId: number;
  maxCapacity: number;
  status: string;
}

export interface IClassScheduleUpdate {
  batchId?: number;
  semesterId?: number;
  subjectId?: number;
  weekDayId?: number;
  roomId?: number;
  facultyId?: number;
  timeSlotId?: number;
  startDate?: string;
  endDate?: string;
  isRecurring?: boolean;
  scheduleTypeId?: number;
  maxCapacity?: number;
  status?: string;
}
