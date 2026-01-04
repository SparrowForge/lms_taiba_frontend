import { EntityStatus } from '@/enums/status';

import { IBatch } from './batch';
import { ICourse } from './course';
import { IExam } from './exam';
import { ISemester } from './semester';
import { ISubject } from './subject';

export interface IQuestionSet {
  id: number;
  name: string;
  description: string;
  courseId: number;
  subjectId: number;
  examId: number;
  semesterId: number;
  batchId: number;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course?: ICourse;
  subject?: ISubject;
  exam?: IExam;
  semester?: ISemester;
  batch?: IBatch;
}

export interface IQuestionSetCreate {
  name: string;
  description: string;
  courseId: number;
  subjectId: number;
  examId: number;
  semesterId: number;
  batchId: number;
  status: EntityStatus;
}

export interface IQuestionSetUpdate {
  name?: string;
  description?: string;
  courseId?: number;
  subjectId?: number;
  examId?: number;
  semesterId?: number;
  batchId?: number;
  status?: EntityStatus;
}

export interface IQuestionSetWithQuestionsCreate {
  questionSet: IQuestionSetCreate;
  questionIds: number[];
}


