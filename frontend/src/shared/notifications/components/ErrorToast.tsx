import type { ToastContentProps } from '../toast.types'
import { PrelineToast } from './PrelineToast'
import { ToastTypeIcon } from './ToastIcons'

export function ErrorToast({ title, message, icon, closable = true, onClose }: ToastContentProps) {
  return (
    <PrelineToast
      type="error"
      title={title}
      message={message}
      icon={icon ?? <ToastTypeIcon type="error" />}
      closable={closable}
      onClose={onClose}
    />
  )
}
