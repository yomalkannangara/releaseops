import { isAxiosError } from 'axios'
import type { ApiErrorResponse } from '../types/api'

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const response = error.response?.data

    if (response?.fieldErrors) {
      const firstFieldError = Object.values(
        response.fieldErrors,
      )[0]

      if (firstFieldError) {
        return firstFieldError
      }
    }

    return response?.message ?? fallback
  }

  return fallback
}