import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { syncHttpSessionFromStorage } from '@features/auth/services/authService'
import { useAuthStore } from '@features/auth/store/authStore'
import { waitForStoreHydration, useLocaleStore, useUiStore } from '@store'

const PERSISTED_STORES = [useAuthStore, useLocaleStore, useUiStore]

type StoreHydrationGateProps = {
  children: ReactNode
}

export function StoreHydrationGate({ children }: StoreHydrationGateProps) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    void waitForStoreHydration(PERSISTED_STORES).then(() => {
      const { user } = useAuthStore.getState()
      syncHttpSessionFromStorage(user?.tenantId)
      setHydrated(true)
    })
  }, [])

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-900">
        <div className="size-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return children
}
