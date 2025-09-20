export interface IDuration {
  hours: number;
  minutes: number;
}

export interface IExamType {
  id: number;
  code: string;
  name: string;
  marks: number;
  duration: IDuration;
  contribution: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IExamTypeCreate {
  code: string;
  name: string;
  marks: number;
  duration: IDuration;
  contribution: string;
  status: string;
}

export interface IExamTypeUpdate {
  code?: string;
  name?: string;
  marks?: number;
  duration?: IDuration;
  contribution?: string;
  status?: string;
}
