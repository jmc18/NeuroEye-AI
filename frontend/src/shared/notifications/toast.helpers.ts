import type { ToastInput, ToastOptions, ToastType } from './toast.types'

export const TOAST_LIMIT = 5

export const DEFAULT_DURATIONS: Record<ToastType, number | false> = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000,
  loading: false,
}

export function normalizeToastInput(input: ToastInput | undefined, fallback = ''): ToastOptions {
  if (input === undefined) {
    return { message: fallback }
  }

  if (typeof input === 'string') {
    return { message: input }
  }

  return input
}

export function resolveAutoClose(
  type: ToastType,
  options: ToastOptions,
): number | false {
  if (options.persistent) {
    return false
  }

  if (options.duration !== undefined) {
    return options.duration
  }

  return DEFAULT_DURATIONS[type]
}
