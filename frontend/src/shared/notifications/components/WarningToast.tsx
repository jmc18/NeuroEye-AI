import type { ToastContentProps } from '../toast.types'
import { PrelineToast } from './PrelineToast'
import { ToastTypeIcon } from './ToastIcons'

export function WarningToast({ title, message, icon, closable = true, onClose }: ToastContentProps) {
  return (
    <PrelineToast
      type="warning"
      title={title}
      message={message}
      icon={icon ?? <ToastTypeIcon type="warning" />}
      closable={closable}
      onClose={onClose}
    />
  )
}
