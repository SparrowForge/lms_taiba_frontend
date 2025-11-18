import { AttendanceStatus } from '@/enums';

import { IBatch } from './batch';
import { IClassSchedule } from './classSchedule';
import { ICourse } from './course';
import { IFaculty } from './faculty';
import { ISemester } from './semester';
import { ISubject } from './subject';

export interface IAttendance {
  id: number;
  courseId: number;
  subjectId: number;
  semesterId: number;
  batchId: number;
  facultyId: number;
  scheduleId: number;
  classNo: number;
  date: string;
  remarks: string;
  status: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course: ICourse;
  subject: ISubject;
  semester: ISemester;
  batch: IBatch;
  faculty: IFaculty;
  schedule: IClassSchedule;
}

export interface IAttendanceCreate {
  courseId: number;
  subjectId: number;
  semesterId: number;
  batchId: number;
  facultyId: number;
  scheduleId: number;
  classNo: number;
  date: string;
  remarks: string;
  status: AttendanceStatus;
}

export interface IAttendanceUpdate {
  courseId?: number;
  subjectId?: number;
  semesterId?: number;
  batchId?: number;
  facultyId?: number;
  scheduleId?: number;
  classNo?: number;
  date?: string;
  remarks?: string;
  status?: AttendanceStatus;
}
