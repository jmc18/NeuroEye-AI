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
    <div className={cn('mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}
