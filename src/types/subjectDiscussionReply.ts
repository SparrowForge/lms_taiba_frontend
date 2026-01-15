import { IFile } from './file';
import { ISubjectDiscussion } from './subjectDiscussion';
import { IUser } from './user';

export interface ISubjectDiscussionReply {
  id: number;
  discussionId: number;
  parentReplyId: number | null;
  authorId: number;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  discussion: ISubjectDiscussion;
  author: IUser;
  attachments: IFile[];
}

export interface ISubjectDiscussionReplyCreate {
  discussionId: number;
  parentReplyId?: number | null;
  content: string;
  fileIds?: number[];
  status: string;
}

export interface ISubjectDiscussionReplyUpdate {
  discussionId?: number;
  parentReplyId?: number | null;
  content?: string;
  fileIds?: number[];
  status?: string;
}
