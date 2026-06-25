import type { ToastContentProps } from '../toast.types'
import { PrelineToast } from './PrelineToast'
import { ToastTypeIcon } from './ToastIcons'

export function InfoToast({ title, message, icon, closable = true, onClose }: ToastContentProps) {
  return (
    <PrelineToast
      type="info"
      title={title}
      message={message}
      icon={icon ?? <ToastTypeIcon type="info" />}
      closable={closable}
      onClose={onClose}
    />
  )
}
