import { ISemester } from './semester';
import { ISubject } from './subject';

export interface ISemesterSubject {
  id: number;
  semesterId: number;
  subjectId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  semester: ISemester;
  subject: ISubject;
}

export interface ISemesterSubjectCreate {
  semesterId: number;
  subjectId: number;
}

export interface ISemesterSubjectUpdate {
  semesterId?: number;
  subjectId?: number;
}

// New interfaces for multiple faculty assignment
export interface IFacultyAssignment {
  facultyId: number;
  hoursPerWeek: number;
  role: string;
}

export interface ISemesterSubjectWithFaculty {
  subjectId: number;
  faculty: IFacultyAssignment[];
}

export interface ISemesterSubjectMultipleCreate {
  semesterId: number;
  subjects: ISemesterSubjectWithFaculty[];
}
