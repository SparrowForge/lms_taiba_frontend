import { ISemesterCreate } from '@/types/semester';
import { ISectionCreate } from '@/types/section';

export interface ISemesterFormData extends ISemesterCreate {
  duration: number;
}

export type ISectionFormData = Omit<ISectionCreate, 'batchId'>;
