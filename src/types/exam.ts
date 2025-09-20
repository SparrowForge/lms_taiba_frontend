import { EntityStatus } from '@/enums/status';

import { IBatch } from './batch';
import { ICourse } from './course';
import { IDuration, IExamType } from './examType';
import { IRoom } from './room';
import { ISemester } from './semester';
import { ISubject } from './subject';

export interface IExam {
  id: number;
  name: string;
  courseId: number;
  subjectId: number;
  semesterId: number;
  batchId: number;
  examTypeId: number;
  roomId: number;
  marks: number;
  examDatetime: string;
  duration: IDuration;
  questionType: string;
  attachmentPath: string | null;
  examQuestion: string | null;
  questionsCount: number;
  optionsPerQuestion: number;
  securityType: string | null;
  spelling: string | null;
  totalStudent: number;
  isApproved: boolean;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course: ICourse;
  subject: ISubject;
  semester: ISemester;
  batch: IBatch;
  examType: IExamType;
  room: IRoom;
}

export interface IExamCreate {
  name: string;
  courseId: number;
  subjectId: number;
  semesterId: number;
  batchId: number;
  examTypeId: number;
  roomId: number;
  marks: number;
  examDatetime: string;
  duration: IDuration;
  questionType: string;
  attachmentPath?: string | null;
  examQuestion?: string | null;
  questionsCount: number;
  optionsPerQuestion: number;
  securityType?: string | null;
  spelling?: string | null;
  totalStudent?: number;
  isApproved?: boolean;
  status: EntityStatus;
}

export interface IExamUpdate {
  name?: string;
  courseId?: number;
  subjectId?: number;
  semesterId?: number;
  batchId?: number;
  examTypeId?: number;
  roomId?: number;
  marks?: number;
  examDatetime?: string;
  duration?: {
    hours: number;
    minutes: number;
  };
  questionType?: string;
  attachmentPath?: string | null;
  examQuestion?: string | null;
  questionsCount?: number;
  optionsPerQuestion?: number;
  securityType?: string | null;
  spelling?: string | null;
  totalStudent?: number;
  isApproved?: boolean;
  status?: EntityStatus;
}
