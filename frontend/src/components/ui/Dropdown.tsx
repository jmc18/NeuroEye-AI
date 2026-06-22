import type { ReactNode } from 'react'

import { usePreline } from '@hooks/usePreline'
import { cn } from '@lib/utils'

type DropdownProps = {
  trigger: ReactNode
  children: ReactNode
  className?: string
  triggerClassName?: string
  menuClassName?: string
  placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const placementClasses: Record<NonNullable<DropdownProps['placement']>, string> = {
  'top-left': 'hs-dropdown [--placement:top-left]',
  'top-right': 'hs-dropdown [--placement:top-right]',
  'bottom-left': 'hs-dropdown [--placement:bottom-left]',
  'bottom-right': 'hs-dropdown [--placement:bottom-right]',
}

export function Dropdown({
  trigger,
  children,
  className,
  triggerClassName,
  menuClassName,
  placement = 'bottom-left',
}: DropdownProps) {
  usePreline()

  return (
    <div className={cn('relative inline-flex', placementClasses[placement], className)}>
      <button
        type="button"
        className={cn('hs-dropdown-toggle', triggerClassName)}
        aria-haspopup="menu"
        aria-expanded="false"
      >
        {trigger}
      </button>
      <div
        className={cn(
          'hs-dropdown-menu hs-dropdown-open:opacity-100 hs-dropdown-open:visible',
          'opacity-0 invisible transition-[opacity,margin] duration-200',
          'min-w-48 bg-white shadow-md rounded-lg p-2 mt-2',
          'dark:bg-neutral-800 dark:border dark:border-neutral-700',
          menuClassName,
        )}
        role="menu"
      >
        {children}
      </div>
    </div>
  )
}
