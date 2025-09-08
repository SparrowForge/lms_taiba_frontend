import { IBatch } from './batch';
import { IFaculty } from './faculty';
import { ISemester } from './semester';
import { ISubject } from './subject';

export interface IFacultySubject {
  id: number;
  facultyId: number;
  subjectId: number;
  semesterId: number;
  batchId: number;
  hoursPerWeek: number;
  role: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  faculty: IFaculty;
  subject: ISubject;
  semester: ISemester;
  batch: IBatch;
}

export interface IFacultySubjectCreate {
  facultyId: number;
  subjectId: number;
  semesterId: number;
  batchId: number;
  hoursPerWeek: number;
  role: string;
}

export interface IFacultySubjectUpdate {
  facultyId?: number;
  subjectId?: number;
  semesterId?: number;
  batchId?: number;
  hoursPerWeek?: number;
  role?: string;
}
