import {ICourse} from './course';
import {IFacultyWithSubjectRole} from './faculty';

export interface ISubject {
  id: number;
  courseId: number;
  name: string;
  code: string;
  creditHours: number;
  theoryHours: number;
  practicalHours: number;
  description: string;
  prerequisite: string;
  status: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course: ICourse;
}

export interface ISubjectCreate {
  courseId: number;
  name: string;
  code: string;
  creditHours: number;
  theoryHours: number;
  practicalHours: number;
  description: string;
  prerequisite: string;
  status: string;
  remarks: string;
}

export interface ISubjectUpdate {
  courseId?: number;
  name?: string;
  code?: string;
  creditHours?: number;
  theoryHours?: number;
  practicalHours?: number;
  description?: string;
  prerequisite?: string;
  status?: string;
  remarks?: string;
}

export interface ISubjectWithFaculty extends ISubject {
  faculties: IFacultyWithSubjectRole[];
}
