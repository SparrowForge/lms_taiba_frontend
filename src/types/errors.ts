export interface IErrorResponse {
  statusCode: number
  message: string
}


// Type guard to check if error has a message
export function isErrorWithMessage(error: unknown): error is IErrorResponse {
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
    return error.message;
  }
  return 'An unknown error occurred';
} 