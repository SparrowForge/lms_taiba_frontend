import { IBatch } from './batch';
import { ICourse } from './course';
import { IFaculty } from './faculty';
import { IFile } from './file';
import { ISemester } from './semester';
import { ISubject } from './subject';

export interface ICourseMaterial {
  id: number;
  courseId: number;
  subjectId: number;
  semesterId: number;
  batchId: number;
  facultyId: number;
  title: string;
  description: string;
  type: string;
  fileId?: number;
  isDownloadable: boolean;
  accessLevel: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course: ICourse;
  subject: ISubject;
  semester: ISemester;
  batch: IBatch;
  faculty: IFaculty;
  file: IFile | null;
}

export interface ICourseMaterialCreate {
  courseId: number;
  subjectId: number;
  semesterId: number;
  batchId: number;
  facultyId: number;
  title: string;
  description: string;
  type: string;
  fileId?: number;
  isDownloadable: boolean;
  accessLevel: string;
  status: string;
}

export interface ICourseMaterialUpdate {
  courseId?: number;
  subjectId?: number;
  semesterId?: number;
  batchId?: number;
  facultyId?: number;
  title?: string;
  description?: string;
  type?: string;
  fileId?: number;
  isDownloadable?: boolean;
  accessLevel?: string;
  status?: string;
}
