import { ErrorResponse } from '../types/error'
import { FirebaseError } from 'firebase/app'

export const handleFirestoreError = (error: unknown): ErrorResponse => {
  // Handle Firebase/Firestore specific errors
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'permission-denied':
        return {
          status: 'error',
          message: 'You dont have permission to access this resource',
          code: '403',
          details: error.message
        }

      case 'not-found':
        return {
          status: 'error',
          message: 'The requested resource was not found',
          code: '404',
          details: error.message
        }

      case 'already-exists':
        return {
          status: 'error',
          message: 'The document already exists',
          code: '409',
          details: error.message
        }

      case 'cancelled':
        return {
          status: 'error',
          message: 'The operation was cancelled',
          code: '499',
          details: error.message
        }

      case 'data-loss':
        return {
          status: 'error',
          message: 'Data loss or corruption detected',
          code: '500',
          details: error.message
        }

      case 'deadline-exceeded':
        return {
          status: 'error',
          message: 'Operation timed out',
          code: '504',
          details: error.message
        }

      case 'failed-precondition':
        return {
          status: 'error',
          message: 'Operation failed due to system state',
          code: '412',
          details: error.message
        }

      case 'invalid-argument':
        return {
          status: 'error',
          message: 'Invalid data provided',
          code: '400',
          details: error.message
        }

      case 'resource-exhausted':
        return {
          status: 'error',
          message: 'Quota exceeded or rate limit hit',
          code: '429',
          details: error.message
        }

      case 'unauthenticated':
        return {
          status: 'error',
          message: 'Authentication required',
          code: '401',
          details: error.message
        }

      case 'unavailable':
        return {
          status: 'error',
          message: 'Service temporarily unavailable',
          code: '503',
          details: error.message
        }

      default:
        return {
          status: 'error',
          message: 'Something went wrong!',
          code: '500',
          details: error.message
        }
    }
  }

  // Handle network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return {
      status: 'error',
      message: 'Network connection failed',
      code: '503',
      details: 'Please check your internet connection'
    }
  }

  // Handle validation errors
  if (error instanceof Error && error.message.includes('validation')) {
    return {
      status: 'error',
      message: 'Validation failed',
      code: '422',
      details: error.message
    }
  }

  // Generic error handler
  return {
    status: 'error',
    message: 'Something went wrong!',
    code: '500',
    details: error instanceof Error ? error.message : 'Unknown error occurred'
  }
}
