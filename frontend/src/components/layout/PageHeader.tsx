import type { ReactNode } from 'react'

import { cn } from '@lib/utils'

type PageHeaderProps = {
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div>
        <h1 className="text-headline-md text-on-surface">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}
