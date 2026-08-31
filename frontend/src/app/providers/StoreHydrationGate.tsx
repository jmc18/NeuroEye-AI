import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { persistAccessToken, syncHttpSessionFromStorage } from '@features/auth/services/authService'
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
      const { user, accessToken } = useAuthStore.getState()
      persistAccessToken(accessToken)
      syncHttpSessionFromStorage(user?.tenantId)
      setHydrated(true)
    })
  }, [])

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return children
}
