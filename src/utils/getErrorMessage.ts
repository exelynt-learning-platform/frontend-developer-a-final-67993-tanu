import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

type ApiError = FetchBaseQueryError | SerializedError | undefined

export function getErrorMessage(
  error: ApiError,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (!error) {
    return fallback
  }

  if ('status' in error) {
    if (error.status === 404) {
      return 'Employee not found.'
    }

    if (error.status === 'FETCH_ERROR') {
      return 'Unable to reach the server. Check your connection and try again.'
    }

    if (error.status === 'TIMEOUT_ERROR') {
      return 'The request timed out. Please try again.'
    }

    if (typeof error.data === 'string' && error.data.trim().length > 0) {
      return error.data
    }
  }

  if ('message' in error && error.message) {
    return error.message
  }

  return fallback
}
