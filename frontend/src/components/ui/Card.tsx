import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@lib/utils'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  padding?: boolean
}

export function Card({ children, className, padding = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-outline-variant/40 bg-surface-container-lowest',
        padding && 'p-5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type KpiCardProps = {
  label: string
  value: string | number
  hint?: string
  icon?: ReactNode
  className?: string
}

export function KpiCard({ label, value, hint, icon, className }: KpiCardProps) {
  return (
    <Card className={cn('flex items-start justify-between gap-3', className)}>
      <div>
        <p className="text-label-caps uppercase tracking-widest text-on-surface-variant">
          {label}
        </p>
        <p className="mt-2 font-data-mono text-3xl font-semibold text-on-surface">{value}</p>
        {hint ? <p className="mt-1 text-xs text-on-surface-variant">{hint}</p> : null}
      </div>
      {icon}
    </Card>
  )
}
