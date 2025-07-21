// API Error types
export interface ApiError {
  message: string;
  status?: number;
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
}

// Generic error type for catch blocks
export type ErrorWithMessage = {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

// Type guard to check if error has a message
export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

// Helper function to extract error message
export function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.response?.data?.message || error.message;
  }
  return 'An unknown error occurred';
} 