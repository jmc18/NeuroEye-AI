import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, type AnyRouter } from '@tanstack/react-router'

import { StoreHydrationGate } from '@app/providers/StoreHydrationGate'
import type { RouterContext } from '@app/router/context'
import { useAuth } from '@hooks/useStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
})

type AppProvidersProps = {
  router: AnyRouter
}

export function AppProviders({ router }: AppProvidersProps) {
  const { isAuthenticated, login, logout } = useAuth()

  const context: RouterContext = {
    auth: { isAuthenticated, login, logout },
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StoreHydrationGate>
        <RouterProvider router={router} context={context} />
      </StoreHydrationGate>
    </QueryClientProvider>
  )
}
