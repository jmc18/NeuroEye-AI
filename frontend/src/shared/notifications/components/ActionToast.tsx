import type { ToastContentProps } from '../toast.types'
import { PrelineToast } from './PrelineToast'
import { ToastTypeIcon } from './ToastIcons'

export function ActionToast({
  type,
  title,
  message,
  action,
  icon,
  closable = true,
  onClose,
}: ToastContentProps) {
  return (
    <PrelineToast
      type={type}
      title={title}
      message={message}
      icon={icon ?? <ToastTypeIcon type={type} />}
      closable={closable}
      onClose={onClose}
      footer={
        action ? (
          <button
            type="button"
            className="inline-flex items-center gap-x-1 rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() => {
              action.onClick()
              onClose?.()
            }}
          >
            {action.label}
          </button>
        ) : null
      }
    />
  )
}
