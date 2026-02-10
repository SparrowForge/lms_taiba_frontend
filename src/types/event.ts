import { EntityStatus } from '@/enums';

import { IBatch } from './batch';
import { IBranch } from './branch';
import { ICourse } from './course';
import { ISemester } from './semester';
import { ISection } from './section';

export interface IEvent {
  id: number;
  eventTypeId: number;
  name: string;
  academicYear: number;
  startAt: string;
  endAt: string;
  isAllDay: boolean;
  courseId?: number;
  course?: ICourse | null;
  batchId?: number;
  batch?: IBatch | null;
  semesterId?: number;
  semester?: ISemester | null;
  sectionId?: number;
  section?: ISection | null;
  isHoliday: boolean;
  isAffectsAttendance: boolean;
  remarks: string;
  status: EntityStatus | string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IEventCreate {
  eventTypeId: number;
  name: string;
  academicYear: number;
  startAt: string;
  endAt: string;
  isAllDay: boolean;
  courseId?: number;
  batchId?: number;
  semesterId?: number;
  sectionId?: number;
  isHoliday: boolean;
  isAffectsAttendance: boolean;
  remarks: string;
  status: EntityStatus | string;
}

export interface IEventUpdate {
  eventTypeId?: number;
  name?: string;
  academicYear?: number;
  startAt?: string;
  endAt?: string;
  isAllDay?: boolean;
  courseId?: number;
  batchId?: number;
  semesterId?: number;
  sectionId?: number;
  isHoliday?: boolean;
  isAffectsAttendance?: boolean;
  remarks?: string;
  status?: EntityStatus | string;
}

