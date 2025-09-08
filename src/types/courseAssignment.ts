import { IBatch } from './batch';
import { ICourse } from './course';
import { IFaculty } from './faculty';
import { ISemester } from './semester';
import { ISubject } from './subject';

export interface ICourseAssignment {
  id: number;
  courseId: number;
  subjectId: number;
  semesterId: number;
  batchId: number;
  facultyId: number;
  title: string;
  description: string;
  type: string;
  totalMarks: number;
  passMarks: number;
  maxAttempts: number;
  publishDate: string;
  dueDate: string;
  allowLateSubmit: boolean;
  latePenalty: number | null;
  attachmentPath: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course: ICourse;
  subject: ISubject;
  semester: ISemester;
  batch: IBatch;
  faculty: IFaculty;
}

export interface ICourseAssignmentCreate {
  courseId: number;
  subjectId: number;
  semesterId: number;
  batchId: number;
  facultyId: number;
  title: string;
  description: string;
  type: string;
  totalMarks: number;
  passMarks: number;
  maxAttempts: number;
  publishDate: string;
  dueDate: string;
  allowLateSubmit: boolean;
  latePenalty?: number;
  attachmentPath?: string;
  status: string;
}

export interface ICourseAssignmentUpdate {
  courseId?: number;
  subjectId?: number;
  semesterId?: number;
  batchId?: number;
  facultyId?: number;
  title?: string;
  description?: string;
  type?: string;
  totalMarks?: number;
  passMarks?: number;
  maxAttempts?: number;
  publishDate?: string;
  dueDate?: string;
  allowLateSubmit?: boolean;
  latePenalty?: number;
  attachmentPath?: string;
  status?: string;
}
