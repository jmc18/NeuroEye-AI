import type { ReactNode } from 'react'

import { usePreline } from '@hooks/usePreline'
import { cn } from '@lib/utils'

type CollapseProps = {
  id: string
  trigger: ReactNode
  children: ReactNode
  className?: string
  triggerClassName?: string
  contentClassName?: string
  defaultOpen?: boolean
}

export function Collapse({
  id,
  trigger,
  children,
  className,
  triggerClassName,
  contentClassName,
  defaultOpen = false,
}: CollapseProps) {
  usePreline()

  return (
    <div className={cn(className)}>
      <button
        type="button"
        className={cn(
          'hs-collapse-toggle inline-flex items-center gap-x-2',
          triggerClassName,
        )}
        id={`${id}-toggle`}
        aria-expanded={defaultOpen}
        aria-controls={id}
        data-hs-collapse={`#${id}`}
      >
        {trigger}
      </button>
      <div
        id={id}
        className={cn(
          'hs-collapse hidden w-full overflow-hidden transition-[height] duration-300',
          defaultOpen && 'open',
          contentClassName,
        )}
        aria-labelledby={`${id}-toggle`}
      >
        {children}
      </div>
    </div>
  )
}
