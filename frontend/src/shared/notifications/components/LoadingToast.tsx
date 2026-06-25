import type { ToastContentProps } from '../toast.types'
import { PrelineToast } from './PrelineToast'
import { ToastTypeIcon } from './ToastIcons'

export function LoadingToast({ title, message, icon, closable = false, onClose }: ToastContentProps) {
  return (
    <PrelineToast
      type="loading"
      title={title ?? 'Processing'}
      message={message}
      icon={icon ?? <ToastTypeIcon type="loading" />}
      closable={closable}
      onClose={onClose}
    />
  )
}
