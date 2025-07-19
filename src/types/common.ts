// Generic base response interface for all API responses
export interface IBaseResponse<T = any> {
  success: boolean
  message: string
  data: T
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

// Pagination interface for list responses
export interface IPaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Paginated response interface
export interface IPaginatedResponse<T> extends IBaseResponse<T[]> {
  meta: IPaginationMeta
}

// Empty response interface for operations that don't return data
export interface IEmptyResponse extends IBaseResponse<null> {
  data: null
} 