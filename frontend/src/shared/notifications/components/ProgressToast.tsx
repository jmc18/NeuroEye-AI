import { cn } from '@lib/utils'

import type { ToastContentProps } from '../toast.types'
import { PrelineToast } from './PrelineToast'
import { ToastTypeIcon } from './ToastIcons'

export function ProgressToast({
  type,
  title,
  message,
  progress = 0,
  icon,
  closable = true,
  onClose,
}: ToastContentProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress))

  return (
    <PrelineToast
      type={type}
      icon={icon ?? <ToastTypeIcon type={type} />}
      closable={closable}
      onClose={onClose}
    >
      <div className="space-y-2">
        {title ? (
          <p className="text-sm font-semibold text-gray-800 dark:text-white">{title}</p>
        ) : null}
        {message ? (
          <p className="text-sm text-gray-600 dark:text-neutral-400">{message}</p>
        ) : null}
        <div className="space-y-1">
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={clampedProgress}
            aria-label={title ?? 'Progress'}
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                type === 'error'
                  ? 'bg-red-600'
                  : type === 'success'
                    ? 'bg-teal-600'
                    : 'bg-blue-600',
              )}
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
          <p className="text-end text-xs text-gray-500 dark:text-neutral-400">{clampedProgress}%</p>
        </div>
      </div>
    </PrelineToast>
  )
}
