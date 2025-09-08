import { IStudent } from './student';

export interface IStudentEducation {
  id: number;
  studentId: number;
  degreeType: string;
  foundationCourse: string | null;
  degreeName: string;
  passingYear: number;
  institute: string;
  result: string;
  groupMajor: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  student: IStudent;
}

export interface IStudentEducationCreate {
  studentId: number;
  degreeType: string;
  foundationCourse?: string | null;
  degreeName: string;
  passingYear: number;
  institute: string;
  result: string;
  groupMajor: string;
}

export interface IStudentEducationUpdate {
  studentId?: number;
  degreeType?: string;
  foundationCourse?: string | null;
  degreeName?: string;
  passingYear?: number;
  institute?: string;
  result?: string;
  groupMajor?: string;
}
