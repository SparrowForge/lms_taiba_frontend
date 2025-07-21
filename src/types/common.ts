export enum Status {
  INITIAL = 'initial',
  LOADING = 'loading',
  SUCCESS = 'success',
  FAILED = 'failed'
}

export interface IStatusState {
  status: Status
  message?: string
}

export interface IBaseResponse<T = any> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

// Generic base response interface for all API responses
export interface IBasePaginatedResponse<T = any> {
  success: boolean
  message: string
  data: {
    items: T[]
    meta: IPaginationMeta
  }
  timestamp: string
}

// Generic error response interface
export interface IErrorResponse {
  success: false
  message: string
  error?: string
  details?: any
  timestamp: string
}


export interface IPaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
