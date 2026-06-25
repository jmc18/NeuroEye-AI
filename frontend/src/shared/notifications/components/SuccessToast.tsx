import type { ToastContentProps } from '../toast.types'
import { PrelineToast } from './PrelineToast'
import { ToastTypeIcon } from './ToastIcons'

export function SuccessToast({ title, message, icon, closable = true, onClose }: ToastContentProps) {
  return (
    <PrelineToast
      type="success"
      title={title}
      message={message}
      icon={icon ?? <ToastTypeIcon type="success" />}
      closable={closable}
      onClose={onClose}
    />
  )
}
