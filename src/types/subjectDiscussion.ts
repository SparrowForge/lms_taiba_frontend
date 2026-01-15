import { IFile } from './file';
import { ISubject } from './subject';
import { ISubjectDiscussionReply } from './subjectDiscussionReply';
import { IUser } from './user';

export interface ISubjectDiscussion {
  id: number;
  subjectId: number;
  authorId: number;
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  subject: ISubject;
  author: IUser;
  attachments: IFile[];
  replies: ISubjectDiscussionReply[];
}

export interface ISubjectDiscussionCreate {
  subjectId: number;
  title: string;
  content: string;
  fileIds?: number[];
  status: string;
  isPinned?: boolean;
  isLocked?: boolean;
}

export interface ISubjectDiscussionUpdate {
  subjectId?: number;
  title?: string;
  content?: string;
  fileIds?: number[];
  status?: string;
  isPinned?: boolean;
  isLocked?: boolean;
}
