import { ExamResultStatus } from '@/enums/exam-candidate.enum';
import { EntityStatus } from '@/enums/status';

import { IBatch } from './batch';
import { ICourse } from './course';
import { IExam } from './exam';
import { ISection } from './section';
import { ISemester } from './semester';
import { ISubject } from './subject';
import { IStudent } from './student';

export interface IExamResult {
  id: number;
  examId: number;
  studentId: number;
  marksObtained: number;
  grade: string;
  remarks: string;
  status: ExamResultStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  student: IStudent;
  exam: IExam;
}

export interface IExamResultCreate {
  examId: number;
  studentId: number;
  marksObtained: number;
  grade: string;
  remarks: string;
  status: EntityStatus;
}

export interface IExamResultUpdate {
  examId?: number;
  studentId?: number;
  marksObtained?: number;
  grade?: string;
  remarks?: string;
  status?: EntityStatus;
}

export interface ISemesterResultsPublishRequest {
  semesterId: number;
}

export interface ISubjectResultsPublishRequest {
  semesterId: number;
  subjectId: number;
}

export interface ISemesterResult {
  id: number;
  studentId: number;
  semesterId: number;
  courseId: number;
  batchId: number;
  sectionId?: number | null;
  gpa?: number | null;
  totalPercentage?: number | null;
  grade?: string | null;
  status: ExamResultStatus;
  remarks?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  student: IStudent;
  semester: ISemester;
  course: ICourse;
  batch: IBatch;
  section?: ISection | null;
}

export interface ISubjectResult {
  id: number;
  studentId: number;
  semesterId: number;
  subjectId: number;
  courseId: number;
  batchId: number;
  sectionId?: number | null;
  totalMarks: number | null;
  percentage: number | null;
  grade?: string | null;
  gradePoint?: number | null;
  status: ExamResultStatus;
  remarks?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  student: IStudent;
  semester: ISemester;
  subject: ISubject;
  course: ICourse;
  batch: IBatch;
  section?: ISection | null;
}
