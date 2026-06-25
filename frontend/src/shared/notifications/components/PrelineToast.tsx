import type { ReactNode } from 'react'

import { cn } from '@lib/utils'

import type { ToastType } from '../toast.types'
import { CloseIcon } from './ToastIcons'

const iconStyles: Record<ToastType, string> = {
  success: 'text-teal-600 dark:text-teal-500',
  error: 'text-red-600 dark:text-red-500',
  warning: 'text-yellow-600 dark:text-yellow-500',
  info: 'text-blue-600 dark:text-blue-500',
  loading: 'text-blue-600 dark:text-blue-500',
}

export type PrelineToastProps = {
  type: ToastType
  title?: string
  message?: string
  icon?: ReactNode
  footer?: ReactNode
  closable?: boolean
  onClose?: () => void
  children?: ReactNode
  className?: string
}

export function PrelineToast({
  type,
  title,
  message,
  icon,
  footer,
  closable = true,
  onClose,
  children,
  className,
}: PrelineToastProps) {
  const showHeader = Boolean(title || message)

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800',
        className,
      )}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className="flex gap-3 p-4">
        {icon ? (
          <div className={cn('mt-0.5 shrink-0', iconStyles[type])} aria-hidden="true">
            {icon}
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          {children ?? (
            showHeader ? (
              <div className="space-y-1">
                {title ? (
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{title}</p>
                ) : null}
                {message ? (
                  <p className="text-sm text-gray-600 dark:text-neutral-400">{message}</p>
                ) : null}
              </div>
            ) : null
          )}

          {footer ? <div className="mt-3">{footer}</div> : null}
        </div>

        {closable && onClose ? (
          <button
            type="button"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
            aria-label="Close notification"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>
    </div>
  )
}
