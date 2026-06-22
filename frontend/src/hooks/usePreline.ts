import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'

import { initializePreline } from '@lib/preline'

export function usePreline(): void {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  useEffect(() => {
    initializePreline()
  }, [pathname])
}
