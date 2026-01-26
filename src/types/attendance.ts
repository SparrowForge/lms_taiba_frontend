import { AttendanceStatus } from '@/enums';

import { IBatch } from './batch';
import { IClassSchedule } from './classSchedule';
import { ICourse } from './course';
import { IFaculty } from './faculty';
import { ISemester } from './semester';
import { IStudent } from './student';
import { ISubject } from './subject';

export interface IAttendance {
  id: number;
  courseId: number;
  subjectId: number;
  semesterId: number;
  batchId: number;
  sectionId?: number | null;
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
  schedule: IClassSchedule | null;
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

export interface IAttendanceStudent {
  id: number;
  studentId: number;
  courseId: number;
  semesterId: number;
  batchId: number;
  sectionId?: number | null;
  facultyId: number;
  attendancePattern: string;
  captureMethodPattern: string;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  leaveCount: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  student: IStudent;
  course: ICourse;
  semester: ISemester;
  batch: IBatch;
  faculty: IFaculty;
  attendances: IAttendance[];
}

export interface IAttendanceBulkGenerateRequest {
  courseId: number;
  batchId: number;
  facultyId: number;
  subjectId: number;
  semesterId: number;
}

export interface IAttendanceBulkGenerateResponse {
  created: number;
  skipped: number;
  errors: string[];
}
