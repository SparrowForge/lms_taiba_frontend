import {CourseAssignmentSubmissionStatus} from '@/enums';

import {ICourseAssignment} from './courseAssignment';
import {IFaculty} from './faculty';
import {IFile} from './file';
import {IStudent} from './student';

export interface ICourseAssignmentSubmission {
  id: number;
  assignmentId: number;
  studentId: number;
  submittedAt: string;
  remark: string;
  fileId: number;
  marksObtained: number;
  feedback: string;
  gradedBy: number;
  gradedAt: string;
  status: CourseAssignmentSubmissionStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  assignment: ICourseAssignment;
  student: IStudent;
  file: IFile;
  grader: IFaculty;
}

export interface ICourseAssignmentSubmissionCreate {
  assignmentId: number;
  studentId: number;
  submittedAt: string;
  remark: string;
  fileId: number;
  marksObtained: number;
  feedback: string;
  gradedBy: number;
  gradedAt: string;
  status: CourseAssignmentSubmissionStatus;
}

export interface ICourseAssignmentSubmissionUpdate {
  assignmentId?: number;
  studentId?: number;
  submittedAt?: string;
  remark?: string;
  fileId?: number;
  marksObtained?: number;
  feedback?: string;
  gradedBy?: number;
  gradedAt?: string;
  status?: CourseAssignmentSubmissionStatus;
}
