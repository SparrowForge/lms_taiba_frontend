import {ClassScheduleStatus} from '@/enums';

import {IAttendance} from './attendance';
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
  status: ClassScheduleStatus;
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
  color: string;
  attendances: IAttendance[];
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
  status: ClassScheduleStatus;
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
  status?: ClassScheduleStatus;
}

export interface IClassScheduleBulkCreateSchedule {
  weekDayId: number;
  roomId: number;
  facultyId: number;
  timeSlotId: number;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  scheduleTypeId: number;
  maxCapacity: number;
}

export interface IClassScheduleBulkCreate {
  batchId: number;
  semesterId: number;
  subjectId: number;
  schedules: IClassScheduleBulkCreateSchedule[];
}

export interface ISchedulePeriod {
  startDate: string;
  endDate: string;
  schedules: IClassSchedule[];
  count: number;
}

export interface IMySchedules {
  userType: 'faculty' | 'student';
  profileId: number;
  today: ISchedulePeriod;
  week: ISchedulePeriod;
  month: ISchedulePeriod;
}
