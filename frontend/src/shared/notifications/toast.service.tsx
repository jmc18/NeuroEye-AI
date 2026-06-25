import type { ReactNode } from 'react'
import { toast as notify, type Id, type ToastOptions as RtToastOptions } from 'react-toastify'

import { ActionToast } from './components/ActionToast'
import { AvatarToast } from './components/AvatarToast'
import { ErrorToast } from './components/ErrorToast'
import { InfoToast } from './components/InfoToast'
import { LoadingToast } from './components/LoadingToast'
import { PrelineToast } from './components/PrelineToast'
import { ProgressToast } from './components/ProgressToast'
import { SuccessToast } from './components/SuccessToast'
import { WarningToast } from './components/WarningToast'
import { normalizeToastInput, resolveAutoClose } from './toast.helpers'
import type {
  ToastContentProps,
  ToastId,
  ToastInput,
  ToastOptions,
  ToastPromiseMessages,
  ToastShowOptions,
  ToastType,
} from './toast.types'

type ToastRendererProps = ToastContentProps & {
  closeToast: () => void
}

function renderToastComponent(props: ToastRendererProps): ReactNode {
  const { type, closeToast, content, avatar, action, progress, closable = true, ...rest } = props

  if (content) {
    return (
      <PrelineToast type={type} closable={closable} onClose={closeToast}>
        {content}
      </PrelineToast>
    )
  }

  if (progress !== undefined) {
    return <ProgressToast {...rest} type={type} progress={progress} closable={closable} onClose={closeToast} />
  }

  if (avatar) {
    return <AvatarToast {...rest} type={type} avatar={avatar} closable={closable} onClose={closeToast} />
  }

  if (action) {
    return <ActionToast {...rest} type={type} action={action} closable={closable} onClose={closeToast} />
  }

  switch (type) {
    case 'success':
      return <SuccessToast {...rest} type={type} closable={closable} onClose={closeToast} />
    case 'error':
      return <ErrorToast {...rest} type={type} closable={closable} onClose={closeToast} />
    case 'warning':
      return <WarningToast {...rest} type={type} closable={closable} onClose={closeToast} />
    case 'loading':
      return <LoadingToast {...rest} type={type} closable={closable} onClose={closeToast} />
    case 'info':
    default:
      return <InfoToast {...rest} type={type} closable={closable} onClose={closeToast} />
  }
}

function buildRtOptions(type: ToastType, options: ToastOptions): RtToastOptions {
  return {
    type: type === 'loading' ? 'default' : type,
    autoClose: resolveAutoClose(type, options),
    closeOnClick: false,
    draggable: false,
    hideProgressBar: true,
    icon: false,
    closeButton: false,
  }
}

function showTyped(type: ToastType, input: ToastInput): ToastId {
  const options = normalizeToastInput(input)

  return notify(
    ({ closeToast }) =>
      renderToastComponent({
        type,
        closeToast,
        closable: options.closable ?? type !== 'loading',
        ...options,
      }),
    buildRtOptions(type, options),
  )
}

function show(options: ToastShowOptions): ToastId {
  const { type = 'info', ...rest } = options
  return showTyped(type, rest)
}

function custom(content: ReactNode, options: ToastOptions = {}): ToastId {
  const normalized = normalizeToastInput(options)

  return notify(
    ({ closeToast }) =>
      renderToastComponent({
        type: 'info',
        closeToast,
        content,
        closable: normalized.closable ?? true,
        ...normalized,
      }),
    buildRtOptions('info', normalized),
  )
}

function promise<T>(promiseOrFn: Promise<T> | (() => Promise<T>), messages: ToastPromiseMessages): Promise<T> {
  const pending = normalizeToastInput(messages.pending, 'Processing...')
  const success = normalizeToastInput(messages.success, 'Completed successfully')
  const error = normalizeToastInput(messages.error, 'Something went wrong')

  const resolvedPromise = typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn

  return notify.promise(
    resolvedPromise,
    {
      pending: {
        render: ({ closeToast }) =>
          renderToastComponent({
            type: 'loading',
            closeToast,
            closable: false,
            ...pending,
          }),
      },
      success: {
        render: ({ closeToast }) =>
          renderToastComponent({
            type: 'success',
            closeToast,
            closable: true,
            ...success,
          }),
      },
      error: {
        render: ({ closeToast }) =>
          renderToastComponent({
            type: 'error',
            closeToast,
            closable: true,
            ...error,
          }),
      },
    },
    buildRtOptions('loading', pending),
  ) as Promise<T>
}

function dismiss(id?: ToastId): void {
  notify.dismiss(id as Id | undefined)
}

function dismissAll(): void {
  notify.dismiss()
}

export const toast = {
  success: (input: ToastInput) => showTyped('success', input),
  error: (input: ToastInput) => showTyped('error', input),
  warning: (input: ToastInput) => showTyped('warning', input),
  info: (input: ToastInput) => showTyped('info', input),
  loading: (input: ToastInput) => showTyped('loading', input),
  show,
  custom,
  promise,
  dismiss,
  dismissAll,
}

export type ToastService = typeof toast
