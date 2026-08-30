import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

type ApiError = FetchBaseQueryError | SerializedError | undefined

export const IMAGE_TOO_LARGE_MESSAGE =
  'The image is too large to save. Choose a smaller photo and try again.'

export function getErrorMessage(
  error: ApiError,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (!error) {
    return fallback
  }

  if ('status' in error) {
    if (isPayloadTooLarge(error)) {
      return IMAGE_TOO_LARGE_MESSAGE
    }

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

export function isNotFoundError(error: ApiError): boolean {
  return Boolean(error && 'status' in error && error.status === 404)
}

function isPayloadTooLarge(error: FetchBaseQueryError): boolean {
  const status =
    typeof error.status === 'number'
      ? error.status
      : error.status === 'PARSING_ERROR'
        ? error.originalStatus
        : undefined

  if (status === 413) {
    return true
  }

  return /payload too large|entity too large|content too large|body too large/i.test(
    getErrorText(error),
  )
}

function getErrorText(error: FetchBaseQueryError): string {
  if (typeof error.data === 'string') {
    return error.data
  }

  if (error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String((error.data as { message: unknown }).message)
  }

  if ('error' in error && typeof error.error === 'string') {
    return error.error
  }

  return ''
}
