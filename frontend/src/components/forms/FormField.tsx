import type { ReactNode } from 'react'

import { cn } from '@lib/utils'

type FormFieldProps = {
  id: string
  label: string
  error?: string
  className?: string
  children: ReactNode
}

export function FormField({ id, label, error, className, children }: FormFieldProps) {
  const hasError = Boolean(error)

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-800 dark:text-white"
      >
        {label}
      </label>
      {children}
      {hasError ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

type FormControlProps = {
  hasError?: boolean
  className?: string
}

export function formControlClassName({ hasError, className }: FormControlProps = {}): string {
  return cn(
    'block w-full rounded-lg border px-3 py-2 text-sm dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-400',
    hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-200 dark:border-neutral-700',
    className,
  )
}
