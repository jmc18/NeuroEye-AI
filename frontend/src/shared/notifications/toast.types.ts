import type { ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export type ToastId = string | number

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastOptions {
  title?: string
  message?: string
  content?: ReactNode
  avatar?: string
  icon?: ReactNode
  action?: ToastAction
  duration?: number
  persistent?: boolean
  closable?: boolean
  progress?: number
}

export interface ToastShowOptions extends ToastOptions {
  type?: ToastType
}

export type ToastInput = string | ToastOptions

export interface ToastPromiseMessages {
  pending?: ToastInput
  success?: ToastInput
  error?: ToastInput
}

export type ToastContentProps = ToastOptions & {
  type: ToastType
  onClose?: () => void
}

export type ToastServiceConfig = {
  limit?: number
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'
}
