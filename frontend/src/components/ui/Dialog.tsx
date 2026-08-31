import type { ReactNode } from 'react'

import { cn } from '@lib/utils'
import { Icon } from './Icon'

type DialogProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

/** Lightweight controlled dialog used by clinical forms. */
export function Dialog({ open, title, onClose, children }: DialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal
        className={cn(
          'w-full max-w-lg rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xl',
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-headline-sm text-on-surface">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container-high"
            aria-label="Close"
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
