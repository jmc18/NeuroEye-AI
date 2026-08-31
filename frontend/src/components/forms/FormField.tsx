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
        className="mb-2 block text-sm font-medium text-on-surface"
      >
        {label}
      </label>
      {children}
      {hasError ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-error" role="alert">
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
    'clinical-focus block w-full rounded-lg border bg-surface-container-low px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant',
    hasError
      ? 'border-error focus:border-error focus:ring-error'
      : 'border-outline-variant',
    className,
  )
}
