import { cn } from '@lib/utils'

export type StatusTone = 'neutral' | 'success' | 'warning' | 'critical' | 'info'

type StatusChipProps = {
  label: string
  tone?: StatusTone
  pulse?: boolean
  className?: string
}

const toneClass: Record<StatusTone, string> = {
  neutral: 'bg-surface-container-high text-on-surface-variant',
  success: 'bg-primary/15 text-primary',
  warning: 'bg-warning/15 text-warning',
  critical: 'bg-error-container text-on-error-container',
  info: 'bg-secondary/15 text-secondary',
}

const dotClass: Record<StatusTone, string> = {
  neutral: 'bg-on-surface-variant',
  success: 'bg-primary',
  warning: 'bg-warning',
  critical: 'bg-error',
  info: 'bg-secondary',
}

export function StatusChip({
  label,
  tone = 'neutral',
  pulse = false,
  className,
}: StatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        toneClass[tone],
        className,
      )}
    >
      <span
        className={cn('size-1.5 rounded-full', dotClass[tone], pulse && 'pulse-status')}
      />
      {label}
    </span>
  )
}
