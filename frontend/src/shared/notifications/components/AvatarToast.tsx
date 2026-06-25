import type { ToastContentProps } from '../toast.types'
import { PrelineToast } from './PrelineToast'

export function AvatarToast({
  avatar,
  title,
  message,
  type,
  closable = true,
  onClose,
}: ToastContentProps) {
  return (
    <PrelineToast
      type={type}
      closable={closable}
      onClose={onClose}
      icon={
        avatar ? (
          <img
            src={avatar}
            alt=""
            className="size-10 shrink-0 rounded-full object-cover ring-2 ring-gray-100 dark:ring-neutral-700"
          />
        ) : undefined
      }
      title={title}
      message={message}
    />
  )
}
