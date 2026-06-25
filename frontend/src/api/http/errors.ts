import { isAxiosError } from 'axios'

import type { ApiError } from '@/types'

export function getApiErrorMessage(error: unknown, fallback = 'Unexpected error'): string {
  if (isAxiosError(error)) {
    const data = error.response?.data

    if (typeof data === 'object' && data !== null && 'detail' in data) {
      const detail = (data as { detail?: unknown }).detail

      if (typeof detail === 'string') {
        return detail
      }

      if (Array.isArray(detail) && detail.length > 0) {
        const first = detail[0] as { msg?: string }
        if (typeof first?.msg === 'string') {
          return first.msg
        }
      }
    }

    return error.message || fallback
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

export function toApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    return {
      message: getApiErrorMessage(error),
      status: error.response?.status,
    }
  }

  return {
    message: getApiErrorMessage(error),
  }
}
