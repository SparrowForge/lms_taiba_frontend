// Status enum moved to centralized enums
// Import from: import { Status } from '@/enums';

import {Status} from '@/enums';

export interface IStatusState {
  status: Status;
  message?: string;
}

export interface IBaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Generic base response interface for all API responses
export interface IBasePaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    meta: IPaginationMeta;
  };
  timestamp: string;
}

// Generic error response interface
export interface IErrorResponse {
  success: false;
  message: string;
  timestamp: string;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
