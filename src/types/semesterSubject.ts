import {ISemester} from './semester';
import {ISubject} from './subject';

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
