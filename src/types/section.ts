import { EntityStatus } from '@/enums';

import { IBatch } from './batch';

export interface ISection {
  id: number;
  batchId: number;
  name: string;
  code: string;
  status: EntityStatus;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  batch: IBatch;
}

export interface ISectionCreate {
  batchId: number;
  name: string;
  code: string;
  status: EntityStatus;
  remarks: string;
}

export interface ISectionUpdate {
  batchId?: number;
  name?: string;
  code?: string;
  status?: EntityStatus;
  remarks?: string;
}

