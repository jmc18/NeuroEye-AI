import type { ReactNode } from 'react'
import { Slide, ToastContainer } from 'react-toastify'

import { TOAST_LIMIT } from './toast.helpers'
import type { ToastServiceConfig } from './toast.types'

import 'react-toastify/dist/ReactToastify.css'

type ToastProviderProps = {
  children: ReactNode
  config?: ToastServiceConfig
}

export function ToastProvider({ children, config }: ToastProviderProps) {
  const limit = config?.limit ?? TOAST_LIMIT
  const position = config?.position ?? 'top-right'

  return (
    <>
      {children}
      <ToastContainer
        position={position}
        newestOnTop
        limit={limit}
        transition={Slide}
        closeButton={false}
        hideProgressBar
        icon={false}
        draggable={false}
        pauseOnFocusLoss
        pauseOnHover
        role="region"
        aria-label="Notifications"
        className="neuroeye-toast-container pointer-events-none"
        toastClassName="neuroeye-toast-item !bg-transparent !p-0 !shadow-none !overflow-visible"
      />
    </>
  )
}
