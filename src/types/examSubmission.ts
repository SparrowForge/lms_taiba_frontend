import { IStudent } from './student';
import { IExam } from './exam';

export interface IExamSubmissionAnswer {
  questionId: number;
  selectedOption?: number;
  answerText?: string;
}

export interface IExamSubmission {
  id: number;
  examId: number;
  studentId: number;
  courseId: number;
  subjectId: number;
  answers: IExamSubmissionAnswer[];
  status: string;
  startedAt: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  exam: IExam;
  student: IStudent;
}

export interface IExamSubmissionCreate {
  examId: number;
  studentId: number;
  courseId: number;
  subjectId: number;
  answers: IExamSubmissionAnswer[];
  status: string;
}

export interface IExamSubmissionUpdate {
  examId?: number;
  studentId?: number;
  courseId?: number;
  subjectId?: number;
  answers?: IExamSubmissionAnswer[];
  status?: string;
}
